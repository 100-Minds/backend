import { ENVIRONMENT } from '@/common/config';
import type { IAwsUploadFile } from '@/common/interfaces';
import AppError from './appError';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { isValidFileNameAwsUpload, isValidPhotoNameAwsUpload } from './helper';
import { AbortController } from 'abort-controller';
import sharp from 'sharp';
import { encode } from 'blurhash';

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

export const r2 = new S3Client({
	region: ENVIRONMENT.R2.REGION,
	endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
		secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
	},
	retryMode: 'standard',
});
export const uploadCourseVideo = async (payload: IAwsUploadFile): Promise<{ secureUrl: string }> => {
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
		Key: fileName,
		Body: buffer,
		ContentType: mimetype,
	};

	let timeout: NodeJS.Timeout | null = null;

	try {
		///implement with redis queue instead
		const abortController = new AbortController();
		timeout = setTimeout(() => abortController.abort(), 60000); // 30-second timeout

		console.log('Sending PutObjectCommand to R2...');
		const command = new PutObjectCommand(uploadParams);
		const response = await r2.send(command, { abortSignal: abortController.signal });

		clearTimeout(timeout);
		console.log('Upload successful, response:', response);

		// Generate secure URL using the CDN
		const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;
		console.log('Generated secure URL:', secureUrl);

		return { secureUrl };
	} catch (error) {
		if (timeout) clearTimeout(timeout);
		console.error('Error uploading video to R2:', error);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new AppError('Video upload timed out. Please try again.', 408);
		}
		throw new AppError('Failed to upload video. Please try again.', 500);
	}
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
		const secureUrl = `${ENVIRONMENT.R2.CDN_URL}/${fileName}`;

		return { secureUrl };
	} catch (error) {
		console.log(error);
		return {
			secureUrl: '',
		};
	}
};
