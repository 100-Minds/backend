import { Request, Response } from 'express';
import { AppError, AppResponse, generatePresignedUrl, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository } from '@/repository';
import { VideoUploadStatus } from '@/common/constants';
import { ENVIRONMENT } from '@/common/config';

export class CourseController {
	createCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, scenarioId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create a course', 403);
		}

		if (!name) {
			throw new AppError('Course name is required', 400);
		}

		const extinguishCourse = await courseRepository.getCourseByName(user.id, name);
		if (extinguishCourse) {
			throw new AppError('Course name exist already', 400);
		}

		const [course] = await courseRepository.create({
			name,
			userId: user.id,
			...(scenarioId && scenarioId.trim() ? { scenarioId } : null),
		});
		if (!course) {
			throw new AppError('Failed to create course', 500);
		}

		return AppResponse(res, 201, toJSON(course), 'Course created successfully');
	});

	getCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		return AppResponse(res, 200, toJSON(course), 'Course successfully fetched');
	});

	updateCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, courseId, scenarioId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can update a course', 403);
		}

		if (!courseId || !name) {
			throw new AppError('Incomplete update data', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		if (course.userId !== user.id) {
			throw new AppError('You are not authorized to update this course name', 403);
		}

		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		const updatedCourse = await courseRepository.update(courseId, {
			name,
			...(scenarioId && scenarioId.trim() ? { scenarioId } : null),
		});

		return AppResponse(res, 200, toJSON(updatedCourse), 'Course updated successfully');
	});

	deleteCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a course', 403);
		}

		if (!courseId) {
			throw new AppError('courseId ID is required', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('courseId not found', 404);
		}

		if (course.userId !== user.id) {
			throw new AppError('You are not authorized to delete this course', 403);
		}

		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		await courseRepository.deleteCourse(courseId);

		return AppResponse(res, 200, null, 'Course deleted successfully');
	});

	createLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, courseId, fileName, fileType, fileSize, videoLength } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a chapter', 403);
		}

		if (!courseId || !title || !fileName || !fileType || !fileSize || !videoLength) {
			throw new AppError('CourseId, title, fileName, fileType, fileSize and videoLength are required', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		if (course.userId !== user.id) {
			throw new AppError('You are not authorized to create a lesson for this course', 403);
		}
		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		const maxChapterResult = await courseRepository.getCourseMaxChapter(courseId);
		const maxNumber = maxChapterResult?.maxNumber ?? 0;

		const [chapter] = await courseRepository.createChapter({ title, courseId, chapterNumber: maxNumber + 1 });
		if (!chapter) {
			throw new AppError('Failed to create chapter', 500);
		}

		// Generate pre-signed URL
		const { signedUrl, key } = await generatePresignedUrl(fileName, fileType, fileSize);

		const [video] = await courseRepository.createVideo({
			chapterId: chapter.id,
			videoURL: `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`,
			duration: videoLength,
			uploadStatus: VideoUploadStatus.PROCESSING,
		});
		if (!video) {
			throw new AppError('Failed to store video metadata', 500);
		}

		return AppResponse(res, 201, { signedUrl, key }, 'Lesson created successfully, use the signed URL to upload.');
	});

	getCourseLessons = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const lessons = await courseRepository.getCourseLessons(courseId as string);
		if (!lessons) {
			throw new AppError('Lessons not found', 404);
		}

		return AppResponse(res, 200, toJSON(lessons), 'Chapters and lessons successfully fetched');
	});

	getCourseLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const lessons = await courseRepository.getCourseLesson(courseId as string, chapterId as string);
		if (!lessons) {
			throw new AppError('Lessons not found', 404);
		}

		return AppResponse(res, 200, toJSON(lessons), 'Chapters and lessons successfully fetched');
	});

	getChapter = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId as string);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		return AppResponse(res, 200, toJSON(chapter), 'Chapter successfully fetched');
	});

	getAllChapters = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const chapters = await courseRepository.getAllChapters(courseId as string);
		if (!chapters) {
			throw new AppError('Chapters not found', 404);
		}

		return AppResponse(res, 200, toJSON(chapters), 'Chapters successfully fetched');
	});

	updateLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, chapterId, fileName, fileType, fileSize, videoLength } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can update a chapter', 403);
		}

		if (!chapterId) {
			throw new AppError('ChapterId is required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		if (chapter.isDeleted) {
			throw new AppError('Chapter has already been deleted', 400);
		}

		if (title) {
			const updatedChapter = await courseRepository.updateChapter(chapterId, { title });
			if (!updatedChapter) {
				throw new AppError('Failed to update chapter', 500);
			}
		}

		let signedUrl: string | undefined, key: string | undefined;
		if (fileName && fileType && fileSize && videoLength) {
			({ signedUrl, key } = await generatePresignedUrl(fileName, fileType, fileSize));

			const videoUpdates = {
				videoURL: `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`,
				duration: videoLength,
				uploadStatus: VideoUploadStatus.PROCESSING,
			};

			const updatedVideo = await courseRepository.updateVideo(chapterId, videoUpdates);
			if (!updatedVideo) {
				throw new AppError('Failed to update lesson video', 500);
			}
		}

		return AppResponse(res, 200, signedUrl ? { signedUrl, key } : null, 'Lesson updated successfully.');
	});

	videoUploaded = catchAsync(async (req: Request, res: Response) => {
		const { key } = req.body;

		if (!key) {
			throw new AppError('Video key is required', 400);
		}

		const video = await courseRepository.getVideoByKey(`${ENVIRONMENT.R2.PUBLIC_URL}/${key}`);
		if (!video) {
			throw new AppError('Video not found', 404);
		}
		if (video.uploadStatus === VideoUploadStatus.COMPLETED) {
			throw new AppError('Video has already been uploaded', 400);
		}
		if (video.uploadStatus === VideoUploadStatus.FAILED) {
			throw new AppError('Video upload failed', 500);
		}

		await courseRepository.updateVideo(video.id, {
			uploadStatus: VideoUploadStatus.COMPLETED,
		});

		return AppResponse(res, 200, null, 'Video upload confirmed');
	});
}

export const courseController = new CourseController();

//frontend code
// function getVideoMetadata(file) {
// 	return new Promise((resolve, reject) => {
// 		const video = document.createElement('video');
// 		video.preload = 'metadata';

// 		video.onloadedmetadata = () => {
// 			URL.revokeObjectURL(video.src);
// 			resolve({
// 				duration: Math.round(video.duration), // in seconds
// 				size: file.size, // in bytes
// 				type: file.type, // MIME type
// 				name: file.name, // Original file name
// 			});
// 		};

// 		video.onerror = () => {
// 			reject(new Error('Error loading video file'));
// 		};

// 		video.src = URL.createObjectURL(file);
// 	});
// }

// // Usage Example
// const fileInput = document.getElementById('videoInput');
// fileInput.addEventListener('change', async (event) => {
// 	const file = event.target.files[0];
// 	if (!file) return;

// 	try {
// 		const metadata = await getVideoMetadata(file);
// 		console.log('Video Metadata:', metadata);

// 		// Send metadata to the backend
// 		const response = await fetch('/api/lessons', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({
// 				courseId: 'your-course-id',
// 				title: 'Lesson Title',
// 				fileName: metadata.name,
// 				fileType: metadata.type,
// 				fileSize: metadata.size,
// 				videoLength: metadata.duration,
// 			}),
// 		});
// 		const data = await response.json();
// 		console.log('Backend Response:', data);
// 	} catch (error) {
// 		console.error('Error getting video metadata:', error);
// 	}
// });

// async function getUploadUrl(file) {
// 	// Extract metadata
// 	const fileName = file.name;
// 	const fileType = file.type;
// 	const fileSize = file.size;
// 	const duration = await getVideoDuration(file); // Function to get video duration

// 	// Request pre-signed URL from backend
// 	const response = await fetch('/api/lessons/generate-upload-url', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ courseId, chapterId, fileName, fileType, fileSize, duration }),
// 	});

// 	const data = await response.json();
// 	return data.uploadUrl;
// }

// async function uploadVideoToR2(file, uploadUrl, key) {
// 	try {
// 		const response = await fetch(uploadUrl, {
// 			method: 'PUT',
// 			body: file,
// 			headers: {
// 				'Content-Type': file.type,
// 			},
// 		});

// 		if (!response.ok) throw new Error('Upload failed');

// 		// Notify backend of successful upload
// 		await fetch('/api/lessons/video-uploaded', {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify({ key }),
// 		});

// 		console.log('Upload successful, backend notified');
// 	} catch (error) {
// 		console.error('Error uploading video:', error);
// 	}
// }
