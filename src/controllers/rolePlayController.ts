import { Request, Response } from 'express';
import { AppError, AppResponse, formatTimeSpent, parseTimeSpent, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { scenarioRepository } from '@/repository';
import { rolePlayRepository } from '@/repository';

export class RolePlayController {
	createRolePlay = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId, timeSpent, courseId, isDone } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!scenarioId || !timeSpent) {
			throw new AppError('Scenario and Timespent are required', 400);
		}

		const seconds = parseInt(timeSpent, 10);
		if (isNaN(seconds) || seconds < 0) {
			throw new AppError('Time spent must be a positive number of seconds', 400);
		}

		const scenarioExists = await scenarioRepository.findById(scenarioId);
		if (!scenarioExists) {
			throw new Error('Invalid or deleted scenario ID');
		}

		const existingRolePlay = await rolePlayRepository.findByScenarioIdAndUserId(scenarioId, user.id);
		if (existingRolePlay) {
			const currentSeconds = parseTimeSpent(existingRolePlay.timeSpent);
			const newSeconds = timeSpent ? parseInt(timeSpent, 10) : 0;
			if (isNaN(newSeconds) || newSeconds < 0) {
				throw new Error('Time spent must be a positive number of seconds');
			}
			const updatedTimeSpent = formatTimeSpent(currentSeconds + newSeconds);

			const updatedRolePlay = await rolePlayRepository.update(existingRolePlay.id, {
				timeSpent: updatedTimeSpent,
				isDone,
			});

			return AppResponse(res, 200, toJSON(updatedRolePlay), 'Role Play updated successfully');
		}

		const formattedTimeSpent = formatTimeSpent(seconds) || '0';

		const [rolePlay] = await rolePlayRepository.create({
			userId: user.id,
			scenarioId,
			timeSpent: formattedTimeSpent,
			...(courseId && courseId.trim() ? { courseId } : null),
		});

		return AppResponse(res, 201, toJSON(rolePlay), 'Role Play created successfully');
	});

	updateRolePlay = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId, timeSpent, isDone, rolePlayId } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!rolePlayId) {
			throw new AppError('Role Play ID is required', 400);
		}

		if (!timeSpent) {
			throw new AppError('Timespent is required', 400);
		}

		const scenarioExists = await scenarioRepository.findById(scenarioId);
		if (!scenarioExists) {
			throw new Error('Invalid or deleted scenario ID');
		}

		const rolePlayExists = await rolePlayRepository.findById(rolePlayId);
		if (!rolePlayExists || rolePlayExists.isDeleted) {
			throw new AppError('Role play not found or deleted', 404);
		}
		if (rolePlayExists.isDone) {
			throw new AppError('Role play has already been completed', 400);
		}
		if (rolePlayExists.userId !== user.id) {
			throw new AppError('You are not authorized to update this role play', 403);
		}

		let updatedTimeSpent = rolePlayExists.timeSpent;
		if (timeSpent) {
			const currentSeconds = parseTimeSpent(rolePlayExists.timeSpent);
			const newSeconds = parseInt(timeSpent, 10);
			if (isNaN(newSeconds) || newSeconds < 0) {
				throw new AppError('Time spent must be a positive number of seconds', 400);
			}
			updatedTimeSpent = formatTimeSpent(currentSeconds + newSeconds);
		}

		const [updatedRolePlay] = await rolePlayRepository.update(rolePlayId, {
			scenarioId,
			timeSpent: updatedTimeSpent,
			isDone,
		});
		if (!updatedRolePlay) {
			throw new AppError('Failed to update role play', 500);
		}

		return AppResponse(res, 200, toJSON(updatedRolePlay), 'Role Play updated successfully');
	});

	getUserRolePlays = catchAsync(async (req: Request, res: Response) => {
		const { userId } = req.query;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can view a users role play', 403);
		}

		if (!userId) {
			throw new AppError('User ID is required', 400);
		}

		const rolePlay = await rolePlayRepository.findByUserId(userId as string);
		if (!rolePlay) {
			throw new AppError('Role Play not found', 404);
		}

		return AppResponse(res, 200, toJSON(rolePlay), 'User Role Play retrieved successfully');
	});

	getUserRolePlay = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId } = req.query;
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!scenarioId) {
			throw new AppError('Role Play ID is required', 400);
		}

		const rolePlay = await rolePlayRepository.findByScenarioIdAndUserId(scenarioId as string, user.id);
		if (!rolePlay || rolePlay.isDeleted) {
			throw new AppError('Role Play not found or deleted', 404);
		}
		if (rolePlay.userId !== user.id) {
			throw new AppError('You are not authorized to view this role play', 409);
		}

		return AppResponse(res, 200, toJSON(rolePlay), 'User Role Play retrieved successfully');
	});
}

export const rolePlayController = new RolePlayController();
