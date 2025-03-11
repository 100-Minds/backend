import { ENVIRONMENT } from '@/common/config';
import type { IAwsUploadFile } from '@/common/interfaces';
import AppError from './appError';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { isValidPhotoNameAwsUpload } from './helper';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (
	!ENVIRONMENT.R2.ACCOUNT_ID ||
	!ENVIRONMENT.R2.REGION ||
	!ENVIRONMENT.R2.ACCESS_KEY_ID ||
	!ENVIRONMENT.R2.SECRET_ACCESS_KEY ||
	!ENVIRONMENT.R2.BUCKET_NAME ||
	!ENVIRONMENT.R2.CDN_URL ||
	!ENVIRONMENT.R2.PUBLIC_URL
) {
	throw new Error('R2 environment variables are not set');
}

export const r2 = new S3Client({
	region: ENVIRONMENT.R2.REGION,
	endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
		secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
	}
});

/**
 * Generates a pre-signed URL for uploading a course video to Cloudflare R2.
 */
export const generatePresignedUrl = async (fileName: string, fileType: string, fileSize: number) => {
	const maxSize = 500 * 1024 * 1024; //500mb
	const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'];

	if (!validVideoTypes.includes(fileType)) {
		throw new AppError('Invalid video format. Supported formats: mp4, mov, webm, avi', 400);
	}

	if (fileSize > maxSize) {
		throw new AppError('File size exceeds 500MB limit', 400);
	}

	const key = `course-videos/${Date.now()}-${fileName}`;
	const command = new PutObjectCommand({
		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
		Key: key,
		ContentType: fileType,
	});

	const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 }); 

	return { signedUrl, key };
};

export const uploadPictureFile = async (payload: IAwsUploadFile): Promise<{ secureUrl: string }> => {
	const { fileName, buffer, mimetype } = payload;

	if (!fileName || !buffer || !mimetype) {
		throw new AppError('File name, buffer and mimetype are required', 400);
	}

	if (fileName && !isValidPhotoNameAwsUpload(fileName)) {
		throw new AppError('Invalid file name', 400);
	}

	let bufferFile = buffer;

	if (mimetype.includes('image')) {
		bufferFile = await sharp(buffer)
			.resize({
				height: 1920,
				width: 1080,
				fit: 'contain',
			})
			.toBuffer();
	}

	const uploadParams = {
		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
		Key: fileName,
		Body: bufferFile,
		ContentType: mimetype,
	};

	try {
		const command = new PutObjectCommand(uploadParams);
		await r2.send(command);
		const secureUrl = `${ENVIRONMENT.R2.PUBLIC_URL}/${fileName}`;

		return { secureUrl };
	} catch (error) {
		console.log(error);
		return {
			secureUrl: '',
		};
	}
};

//For Uploading to r2 directly
// const getVideoDuration = (buffer: Buffer): Promise<number> => {
// 	return new Promise((resolve, reject) => {
// 		ffmpeg.setFfprobePath(ffprobeStatic.path);
// 		ffmpeg(Readable.from(buffer)).ffprobe((err, metadata) => {
// 			if (err) {
// 				reject(new Error(`Failed to get video duration: ${err.message}`));
// 				return;
// 			}
// 			const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
// 			if (!videoStream || !videoStream.duration) {
// 				reject(new Error('Could not determine video duration'));
// 				return;
// 			}
// 			resolve(parseFloat(videoStream.duration));
// 		});
// 	});
// };
// export const uploadCourseVideo = async (
// 	payload: IAwsUploadFile
// ): Promise<{ secureUrl: string; formattedDuration: string }> => {
// 	const { fileName, buffer, mimetype } = payload;

// 	if (!fileName || !buffer || !mimetype) {
// 		throw new AppError('File name, buffer, and mimetype are required', 400);
// 	}

// 	const validVideoTypes = ['video/mp4', 'video/mov', 'video/webm', 'video/avi'];
// 	if (!validVideoTypes.includes(mimetype)) {
// 		throw new AppError('Invalid video format. Supported formats: mp4, mov, webm, avi', 400);
// 	}

// 	if (!isValidFileNameAwsUpload(fileName)) {
// 		throw new AppError('Invalid file name or extension', 400);
// 	}

// 	let formattedDuration: string = '';
// 	try {
// 		const duration = await getVideoDuration(buffer);
// 		formattedDuration = formatDuration(duration);
// 	} catch (error) {
// 		console.log('Could not determine video duration:', error);
// 	}

// 	const uploadParams = {
// 		Bucket: ENVIRONMENT.R2.BUCKET_NAME,
// 		Key: fileName,
// 		Body: buffer,
// 		ContentType: mimetype,
// 	};

// 	let timeout: NodeJS.Timeout | null = null;

// 	try {
// 		///implement with redis queue instead
// 		const abortController = new AbortController();
// 		timeout = setTimeout(() => abortController.abort(), 60000); // 30-second timeout

// 		console.log('Sending PutObjectCommand to R2...');
// 		const command = new PutObjectCommand(uploadParams);
// 		const response = await r2.send(command, { abortSignal: abortController.signal });

// 		clearTimeout(timeout);
// 		console.log('Upload successful, response:', response);

// 		// Generate secure URL using the CDN
// 		const secureUrl = `${ENVIRONMENT.R2.PUBLIC_URL}/${fileName}`;
// 		console.log('Generated secure URL:', secureUrl);

// 		return { secureUrl, formattedDuration };
// 	} catch (error) {
// 		if (timeout) clearTimeout(timeout);
// 		console.error('Error uploading video to R2:', error);
// 		if (error instanceof Error && error.name === 'AbortError') {
// 			throw new AppError('Video upload timed out. Please try again.', 408);
// 		}
// 		throw new AppError('Failed to upload video. Please try again.', 500);
// 	}
// };
