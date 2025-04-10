import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, favouritesRepository } from '@/repository';
import { catchAsync } from '@/middlewares';

class FavouritesController {
	createFavourite = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId } = req.body;

		if (!user) throw new AppError('Please log in again', 401);
		if (!chapterId || !courseId) {
			throw new AppError('Chapter ID, Course ID are required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.courseId !== courseId) {
			throw new AppError('Chapter does not belong to the specified course', 400);
		}

		const [favourite] = await favouritesRepository.create({
			userId: user.id,
			chapterId,
			courseId,
		});
		if (!favourite) {
			throw new AppError('Failed to favourite chapter this chapter', 500);
		}

		return AppResponse(res, 200, toJSON([favourite]), 'Chapter favourited successfully');
	});

    getUserChapterFavourite = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId } = req.query;

		if (!user) throw new AppError('Please log in again', 401);
		if (!chapterId || !courseId) {
			throw new AppError('Chapter ID and Course ID are required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId as string);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		const [favourite] = await favouritesRepository.getUserFavourites(user.id, chapterId as string);
		if (!favourite) {
			throw new AppError('No favourite entry found', 404);
		}

		return AppResponse(res, 200, toJSON([favourite]), 'Favourite fetched successfully');
	});

	deleteFavourite = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId, favouriteId } = req.body;

		if (!user) throw new AppError('Please log in again', 401);
		if (!chapterId || !courseId || !favouriteId) {
			throw new AppError('Chapter ID, Course, and Favourite ID are required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.courseId !== courseId) {
			throw new AppError('Chapter does not belong to the specified course', 400);
		}

		const favouriteEntry = await favouritesRepository.findById(favouriteId);
		if (!favouriteEntry) {
			throw new AppError('No favourite entry found', 404);
		}

		const [favourite] = await favouritesRepository.update(favouriteId, {
			isDeleted: true,
		});
		if (!favourite) {
			throw new AppError('Failed to delete favourites', 500);
		}

		return AppResponse(res, 200, null, 'Course favourite deleted successfully');
	});
}

export const favouritesController = new FavouritesController();
