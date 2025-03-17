import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { lastWatchedRepository, courseRepository } from '@/repository';
import { DateTime } from 'luxon';

export class LastWatchedController {
	create = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId, videoId, duration } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId || !videoId || !duration) {
			throw new AppError('CourseId, videoId, duration and lastwatched are required', 400);
		}

		const course = await courseRepository.findOne(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const video = await courseRepository.getVideo(videoId);
		if (!video) {
			throw new AppError('Video not found', 404);
		}

		const now = DateTime.utc().toISO();
		const [existingLastWatched] = await lastWatchedRepository.findByVideoAndCourse(videoId, courseId);
		if (existingLastWatched) {
			const [updateLastWatched] = await lastWatchedRepository.update(existingLastWatched.id, {
				lastWatchedAt: new Date(now),
				duration,
			});
			return AppResponse(res, 200, toJSON([updateLastWatched]), 'Last watched video updated successfully');
		}

		const [createLastWatched] = await lastWatchedRepository.create({
			userId: user.id,
			moduleId: course.moduleId,
			courseId,
			chapterId: video.chapterId,
			videoId,
			duration,
			lastWatchedAt: new Date(now),
		});
		if (!createLastWatched) {
			throw new AppError('Failed to create last watched', 500);
		}

		return AppResponse(res, 200, toJSON([createLastWatched]), 'Last watched video created successfully');
	});

	getUserLastWatched = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('CourseId is required', 400);
		}

		const course = await courseRepository.findOne(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const [lastWatched] = await lastWatchedRepository.findByUserIdAndCourse(user.id, courseId as string);
		if (!lastWatched) {
			throw new AppError('Last watched video not found', 404);
		}

		return AppResponse(res, 200, toJSON(lastWatched), 'Last watched video retrieved successfully');
	});
}

export const lastWatchedController = new LastWatchedController();
