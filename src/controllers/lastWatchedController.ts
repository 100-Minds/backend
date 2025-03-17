import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { lastWatchedRepository } from '@/repository';

export class LastWatchedController {
	create = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { lastWatched, courseId, videoId, duration } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!lastWatched || !courseId || !videoId || !duration) {
			throw new AppError('CourseId, videoId, duration and lastwatched are required', 400);
		}

		const [existingLastWatched] = await lastWatchedRepository.findByVideoId(videoId);
		if (existingLastWatched) {
			const [updateLastWatched] = await lastWatchedRepository.update(existingLastWatched.id, {
				lastWatchedAt: new Date(),
				duration,
			});
			return AppResponse(res, 200, toJSON(updateLastWatched), 'Last watched video updated successfully');
		}

		const [createLastWatched] = await lastWatchedRepository.create({
			userId: user.id,
			courseId,
			videoId,
			duration,
			lastWatchedAt: new Date(),
		});
		if (!createLastWatched) {
			throw new AppError('Failed to create last watched', 500);
		}

		return AppResponse(res, 200, toJSON(lastWatched), 'Last watched video created successfully');
	});

	getUserLastWatched = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
        
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const lastWatched = await lastWatchedRepository.findByUserId(user.id);
		if (!lastWatched) {
			throw new AppError('Last watched video not found', 404);
		}

		return AppResponse(res, 200, toJSON(lastWatched), 'Last watched video retrieved successfully');
	});
}

export const lastWatchedController = new LastWatchedController();
