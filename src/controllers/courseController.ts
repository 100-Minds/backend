import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadCourseVideo } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository } from '@/repository';
import { ICourseVideo } from '@/common/interfaces';

export class CourseController {
	createCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, scenarioId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create a team', 403);
		}

		if (!name) {
			throw new AppError('Course name is required', 400);
		}

		const extinguishTeam = await courseRepository.getCourseByName(user.id, name);
		if (extinguishTeam) {
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
		const { title, courseId } = req.body;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a chapter', 403);
		}

		if (!courseId || !title || !file) {
			throw new AppError('CourseId, courseTitle and video file is required', 400);
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

		const { secureUrl } = await uploadCourseVideo({
			fileName: `course-videos/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const video = await courseRepository.createVideo({
			chapterId: chapter.id,
			videoURL: secureUrl,
		});
		if (!video) {
			throw new AppError('Failed to create lesson video', 500);
		}

		return AppResponse(res, 201, null, 'Lesson created successfully');
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
		const { title, chapterId } = req.body;
		const { file } = req;

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

		const updatedChapter = await courseRepository.updateChapter(chapterId, { title });
		if (!updatedChapter) {
			throw new AppError('Failed to update chapter', 500);
		}

		let updatedVideo: ICourseVideo;
		if (file) {
			const { secureUrl } = await uploadCourseVideo({
				fileName: `course-videos/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});

			const videoUpdates: Partial<ICourseVideo> = {
				videoURL: secureUrl,
			};

			[updatedVideo] = await courseRepository.updateVideo(chapterId, videoUpdates);
			if (!updatedVideo) {
				throw new AppError('Failed to update lesson video', 500);
			}
		}

		return AppResponse(res, 200, null, 'Chapter updated successfully');
	});
}

export const courseController = new CourseController();
