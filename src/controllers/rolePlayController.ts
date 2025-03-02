import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { scenarioRepository } from '@/repository';
import { rolePlayRepository } from '@/repository';

export class RolePlayController {
	createRolePlay = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId } = req.body;
		const { user } = req;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a scenario', 403);
		}
	

		return AppResponse(res, 201, null, 'Role Play created successfully');
	});

	findOne = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId } = req.query;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can view a scenario', 403);
		}

		if (!scenarioId) {
			throw new AppError('Scenario ID is required', 400);
		}

		const scenario = await scenarioRepository.findOne(scenarioId as string);
		if (!scenario) {
			throw new AppError('Scenario not found', 404);
		}

		return AppResponse(res, 200, toJSON(scenario), 'Role Play retrieved successfully');
	});

	getAllScenarios = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can view scenarios', 403);
		}

		const scenarios = await scenarioRepository.findAll();
		if (!scenarios) {
			throw new AppError('No scenarios found', 404);
		}

		return AppResponse(res, 200, toJSON(scenarios), 'Role Plays retrieved successfully');
	});

	updateScenario = catchAsync(async (req: Request, res: Response) => {
		const { scenario, scenarioId } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a scenario', 403);
		}
		if (!scenarioId) {
			throw new AppError('Scenario ID is required', 400);
		}
		if (!scenario) {
			throw new AppError('Scenario is required', 400);
		}

		const extinguishScenario = await scenarioRepository.findById(scenarioId);
		if (!extinguishScenario) {
			throw new AppError('Scenario not found', 404);
		}

		if (extinguishScenario.userId !== user.id) {
			throw new AppError('You are not authorized to update this scenario', 403);
		}

		if (extinguishScenario.isDeleted) {
			throw new AppError('Scenario has already been deleted', 400);
		}

		const updateScenario = await scenarioRepository.update(scenarioId, {
			scenario,
		});

		if (!updateScenario) {
			throw new AppError('Failed to update scenario', 500);
		}

		return AppResponse(res, 200, toJSON(updateScenario), 'Role Play updated successfully');
	});

	deleteScenario = catchAsync(async (req: Request, res: Response) => {
		const { scenarioId } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a scenario', 403);
		}
		if (!scenarioId) {
			throw new AppError('Scenario ID is required', 400);
		}

		const extinguishScenario = await scenarioRepository.findById(scenarioId);
		if (!extinguishScenario) {
			throw new AppError('Scenario not found', 404);
		}
		if (extinguishScenario.userId !== user.id) {
			throw new AppError('You are not authorized to delete this scenario', 403);
		}
		if (extinguishScenario.isDeleted) {
			throw new AppError('Scenario has already been deleted', 400);
		}

		const deleteScenario = await scenarioRepository.update(scenarioId, {
			isDeleted: true,
		});
		if (!deleteScenario) {
			throw new AppError('Failed to delete scenario', 500);
		}

		return AppResponse(res, 200, null, 'Role Play deleted successfully');
	});
}

export const rolePlayController = new RolePlayController();
