// import { ENVIRONMENT } from '@/common/config';
// import type { IAwsUploadFile } from '@/common/interfaces';
// import AppError from './appError';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { isValidFileNameAwsUpload } from './helper';

// if (
// 	!ENVIRONMENT.R2.ACCOUNT_ID ||
// 	!ENVIRONMENT.R2.REGION ||
// 	!ENVIRONMENT.R2.ACCESS_KEY_ID ||
// 	!ENVIRONMENT.R2.SECRET_ACCESS_KEY ||
// 	!ENVIRONMENT.R2.BUCKET_NAME ||
// 	!ENVIRONMENT.R2.CDN_URL
// ) {
// 	throw new Error('R2 environment variables are not set');
// }

// // S3 client for Cloudflare R2
// export const r2 = new S3Client({
// 	region: ENVIRONMENT.R2.REGION,
// 	endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
// 	credentials: {
// 		accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
// 		secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
// 	},
// });

// // export const s3 = new S3Client({
// // 	region: ENVIRONMENT.AWS_REGION,
// // 	credentials: {
// // 		accessKeyId: ENVIRONMENT.AWS_ACCESS_KEY_ID,
// // 		secretAccessKey: ENVIRONMENT.AWS_SECRET_ACCESS_KEY,
// // 	},
// // });

// export const uploadCourseVideo = async (payload: IAwsUploadFile): Promise<{ secureUrl: string }> => {
// 	const { fileName, buffer, mimetype } = payload;

// 	if (!fileName || !buffer || !mimetype) {
// 		throw new AppError('File name, buffer, and mimetype are required', 400);
// 	}

// 	console.log('uploadCourseVideo', fileName, buffer, mimetype);

// 	const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'];
// 	if (!validVideoTypes.includes(mimetype)) {
// 		throw new AppError('Invalid video format. Supported formats: mp4, mov, webm, avi', 400);
// 	}

// 	if (!isValidFileNameAwsUpload(fileName)) {
// 		throw new AppError('Invalid file name or extension', 400);
// 	}

// 	const uploadParams = {
// 		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
// 		Key: fileName, // e.g., "course-videos/video-uuid.mp4"
// 		Body: buffer,
// 		ContentType: mimetype,
// 	};

// 	try {
// 		const command = new PutObjectCommand(uploadParams);
// 		await r2.send(command);

// 		// Generate secure URL using the CDN
// 		const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;
// 		return { secureUrl };
// 	} catch (error) {
// 		console.error('Error uploading video to S3:', error);
// 		throw new AppError('Failed to upload video. Please try again.', 500);
// 	}
// };

/////////With Blurhash///////////
import { ENVIRONMENT } from '@/common/config';
import type { IAwsUploadFile } from '@/common/interfaces';
import AppError from './appError';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { encode } from 'blurhash';
import ffmpeg from 'fluent-ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import { Readable } from 'stream';
import { isValidFileNameAwsUpload } from './helper';

if (
	!ENVIRONMENT.R2.ACCOUNT_ID ||
	!ENVIRONMENT.R2.REGION ||
	!ENVIRONMENT.R2.ACCESS_KEY_ID ||
	!ENVIRONMENT.R2.SECRET_ACCESS_KEY ||
	!ENVIRONMENT.R2.BUCKET_NAME ||
	!ENVIRONMENT.R2.CDN_URL
) {
	throw new Error('R2 environment variables are not set');
}

// S3 client for Cloudflare R2
export const r2 = new S3Client({
	region: ENVIRONMENT.R2.REGION,
	endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
		secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
	},
});

ffmpeg.setFfprobePath(ffprobeStatic.path);

const extractVideoFrame = (buffer: Buffer): Promise<Buffer> =>
	new Promise((resolve, reject) => {
		// Convert Buffer to Readable stream
		const readableStream = Readable.from(buffer);

		ffmpeg(readableStream)
			.outputOptions('-frames:v 1') // Extract first frame
			.outputFormat('png')
			.pipe()
			.on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
			.on('end', () => {
				const chunks: Buffer[] = [];
				readableStream.on('data', (chunk: Buffer) => chunks.push(chunk));
				readableStream.on('end', () => resolve(Buffer.concat(chunks)));
			});
	});

const generateBlurHash = async (buffer: Buffer): Promise<string> => {
	const { data, info } = await sharp(buffer).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
	return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
};

export const uploadCourseVideo = async (payload: IAwsUploadFile): Promise<{ secureUrl: string; blurHash?: string }> => {
	const { fileName, buffer, mimetype } = payload;

	if (!fileName || !buffer || !mimetype) {
		throw new AppError('File name, buffer, and mimetype are required', 400);
	}

	const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'];
	if (!validVideoTypes.includes(mimetype)) {
		throw new AppError('Invalid video format. Supported formats: mp4, mov, webm, avi', 400);
	}

	if (!isValidFileNameAwsUpload(fileName)) {
		throw new AppError('Invalid file name or extension', 400);
	}

	const uploadParams = {
		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
		Key: fileName, // e.g., "course-videos/video-uuid.mp4"
		Body: buffer,
		ContentType: mimetype,
	};

	try {
		const command = new PutObjectCommand(uploadParams);
		await r2.send(command);

		// Generate secure URL using the CDN
		const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;

		let blurHash: string | undefined = undefined;

		// Generate blurhash from the video's first frame
		if (validVideoTypes.includes(mimetype)) {
			try {
				const frameBuffer = await extractVideoFrame(buffer);
				blurHash = await generateBlurHash(frameBuffer);
			} catch (error) {
				console.warn('Failed to generate blurhash for video:', error);
				// Optional: Continue without blurhash
			}
		}

		console.log({
			secureUrl,
			blurHash,
		});

		return {
			secureUrl,
			blurHash,
		};
	} catch (error) {
		console.error('Error uploading video to R2:', error);
		throw new AppError('Failed to upload video. Please try again.', 500);
	}
};

////////BLURHASH WITH
// import { ENVIRONMENT } from '@/common/config';
// import type { IAwsUploadFile } from '@/common/interfaces';
// import AppError from './appError';
// import { isValidFileNameAwsUpload } from './helper';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import sharp from 'sharp';
// import { encode } from 'blurhash';
// import ffmpeg from 'fluent-ffmpeg';
// import ffprobeStatic from 'ffprobe-static';
// import { Readable } from 'stream';
// import { Queue } from 'bull'; // Optional for batching large files
// import { promisify } from 'util';
// import { setTimeout as setTimeoutPromise } from 'timers/promises';

// // Validate environment variables at startup
// if (
//     !ENVIRONMENT.R2.ACCOUNT_ID ||
//     !ENVIRONMENT.R2.REGION ||
//     !ENVIRONMENT.R2.ACCESS_KEY_ID ||
//     !ENVIRONMENT.R2.SECRET_ACCESS_KEY ||
//     !ENVIRONMENT.R2.BUCKET_NAME ||
//     !ENVIRONMENT.R2.CDN_URL
// ) {
//     throw new Error('R2 environment variables are not set');
// }

// // S3 client for Cloudflare R2
// export const r2 = new S3Client({
//     region: ENVIRONMENT.R2.REGION,
//     endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
//     credentials: {
//         accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
//         secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
//     },
// });

// // Configure ffmpeg with ffprobe path
// ffmpeg.setFfprobePath(ffprobeStatic.path);

// // Optional: Bull queue for batching (if handling large files in background)
// const frameExtractionQueue = new Queue('frameExtraction', 'redis://127.0.0.1:6379'); // Adjust Redis URL

// /**
//  * Extract the first frame from a video buffer and return it as a Buffer, with timeout and retries.
//  * @param buffer Video buffer.
//  * @param maxAttempts Number of retry attempts.
//  * @param timeoutMs Timeout in milliseconds.
//  * @returns Buffer of the first frame as an image (PNG).
//  */
// const extractVideoFrame = async (buffer: Buffer, maxAttempts: number = 3, timeoutMs: number = 30000): Promise<Buffer> => {
//     let attempts = 0;

//     const attemptExtract = async () => {
//         const readableStream = Readable.from(buffer);

//         return new Promise<Buffer>((resolve, reject) => {
//             const ffProcess = ffmpeg(readableStream)
//                 .outputOptions('-frames:v 1') // Extract first frame
//                 .outputFormat('png')
//                 .pipe();

//             let chunks: Buffer[] = [];

//             // Set timeout for the entire operation
//             const timeout = setTimeout(() => {
//                 ffProcess.destroy(); // Kill the process on timeout
//                 reject(new Error('Frame extraction timed out'));
//             }, timeoutMs);

//             ffProcess
//                 .on('data', (chunk: Buffer) => chunks.push(chunk))
//                 .on('error', (err) => {
//                     clearTimeout(timeout);
//                     reject(new Error(`FFmpeg error: ${err.message}`));
//                 })
//                 .on('end', () => {
//                     clearTimeout(timeout);
//                     resolve(Buffer.concat(chunks));
//                 });
//         });
//     };

//     while (attempts < maxAttempts) {
//         try {
//             return await attemptExtract();
//         } catch (error) {
//             attempts++;
//             if (attempts === maxAttempts) {
//                 console.error(`Frame extraction failed after ${maxAttempts} attempts:`, error);
//                 throw new AppError('Failed to extract video frame after multiple attempts', 500);
//             }
//             console.warn(`Retry ${attempts} for frame extraction: ${error.message}`);
//             await setTimeoutPromise(1000 * attempts); // Exponential backoff (1s, 2s, 3s)
//         }
//     }

//     throw new AppError('Unexpected error in frame extraction', 500);
// };

// /**
//  * Generate a blurhash from an image buffer.
//  * @param buffer Image buffer (e.g., PNG from video frame).
//  * @returns Blurhash string.
//  */
// const generateBlurHash = async (buffer: Buffer): Promise<string> => {
//     const { data, info } = await sharp(buffer).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
//     return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
// };

// /**
//  * Upload a course video to Cloudflare R2, generate a blurhash, and return its secure URL and blurhash.
//  * @param payload File details (fileName, buffer, mimetype).
//  * @returns Object with the secure URL and optional blurhash of the uploaded video.
//  */
// export const uploadCourseVideo = async (payload: IAwsUploadFile): Promise<{ secureUrl: string; blurHash?: string }> => {
//     const { fileName, buffer, mimetype } = payload;

//     // Validate required fields
//     if (!fileName || !buffer || !mimetype) {
//         throw new AppError('File name, buffer, and mimetype are required', 400);
//     }

//     // Validate file type (ensure it's a video)
//     const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'];
//     if (!validVideoTypes.includes(mimetype)) {
//         throw new AppError('Invalid video format. Supported formats: mp4, mov, webm, avi', 400);
//     }

//     // Use your existing file name validation
//     if (!isValidFileNameAwsUpload(fileName)) {
//         throw new AppError('Invalid file name', 400);
//     }

//     const uploadParams = {
//         Bucket: ENVIRONMENT.R2.BUCKET_NAME,
//         Key: fileName, // e.g., "course-videos/video-uuid.mp4"
//         Body: buffer,
//         ContentType: mimetype,
//     };

//     try {
//         const command = new PutObjectCommand(uploadParams);
//         await r2.send(command);

//         // Generate secure URL using the CDN
//         const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;

//         let blurHash: string | undefined = undefined;

//         // Generate blurhash from the video's first frame, with performance and error handling
//         if (validVideoTypes.includes(mimetype)) {
//             try {
//                 // Check video size to optimize or batch if large
//                 const videoSize = buffer.length / 1024 / 1024; // Size in MB
//                 if (videoSize > 100) { // Example threshold for large files
//                     console.warn(`Large video detected (${videoSize}MB), queuing frame extraction`);
//                     blurHash = await new Promise((resolve, reject) => {
//                         frameExtractionQueue.add({ buffer, fileName }, {
//                             attempts: 3,
//                             backoff: { type: 'exponential', delay: 1000 },
//                         }).then((job) => job.finished().then(resolve).catch(reject));
//                     });
//                 } else {
//                     const frameBuffer = await extractVideoFrame(buffer, 3, 30000); // 3 retries, 30s timeout
//                     blurHash = await generateBlurHash(frameBuffer);
//                 }
//             } catch (error) {
//                 console.warn('Failed to generate blurhash for video:', error);
//                 // Optional: Continue without blurhash
//             }
//         }

//         console.log({
//             secureUrl,
//             blurHash,
//         });

//         return {
//             secureUrl,
//             blurHash,
//         };
//     } catch (error) {
//         console.error('Error uploading video to R2:', error);
//         throw new AppError('Failed to upload video. Please try again.', 500);
//     }
// };

// // Optional: Worker for frame extraction queue (run separately, e.g., in a worker process)
// if (process.env.NODE_ENV !== 'test') {
//     frameExtractionQueue.process(async (job) => {
//         const { buffer } = job.data;
//         const frameBuffer = await extractVideoFrame(buffer, 3, 60000); // Longer timeout for queued jobs
//         const blurHash = await generateBlurHash(frameBuffer);
//         return blurHash;
//     });
// }
