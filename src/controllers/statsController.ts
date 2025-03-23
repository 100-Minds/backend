import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { statsRepository } from '@/repository';

export class StatsController {
	findStats = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Unauthorized access', 401);
		}

		const statistics = await statsRepository.findStats();
		if (!statistics) {
			throw new AppError('No statistics found', 404);
		}

		return AppResponse(res, 200, toJSON([statistics]), 'Stats fetched successfully');
	});
}

export const statsController = new StatsController();
