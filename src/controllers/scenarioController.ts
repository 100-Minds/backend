import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadPictureFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { scenarioRepository } from '@/repository';
import { IScenario } from '@/common/interfaces';

export class ScenarioController {
	createScenario = catchAsync(async (req: Request, res: Response) => {
		const { scenario } = req.body;
		const { user } = req;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!file) {
			throw new AppError('Scenario image is required', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a scenario', 403);
		}
		if (!scenario) {
			throw new AppError('Scenario is required', 400);
		}

		const { secureUrl: scenarioImage } = await uploadPictureFile({
			fileName: `scenario-image/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const [createScenario] = await scenarioRepository.create({
			scenario,
			userId: user.id,
			scenarioImage,
		});

		if (!createScenario) {
			throw new AppError('Failed to create scenario', 500);
		}

		return AppResponse(res, 201, toJSON(createScenario), 'Scenario created successfully');
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

		return AppResponse(res, 200, toJSON(scenario), 'Scenario retrieved successfully');
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

		return AppResponse(res, 200, toJSON(scenarios), 'Scenarios retrieved successfully');
	});

	updateScenario = catchAsync(async (req: Request, res: Response) => {
		const { scenario, scenarioId } = req.body;
		const { user } = req;
		const { file } = req;

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

		let updateScenario: IScenario[] | null;
		if (file) {
			const { secureUrl: scenarioImage } = await uploadPictureFile({
				fileName: `scenario-image/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});

			updateScenario = await scenarioRepository.update(scenarioId, {
				scenarioImage,
				scenario,
			});
		} else {
			updateScenario = await scenarioRepository.update(scenarioId, {
				scenario,
			});
		}

		if (!updateScenario) {
			throw new AppError('Failed to update scenario', 500);
		}

		return AppResponse(res, 200, toJSON(updateScenario), 'Scenario updated successfully');
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

		return AppResponse(res, 200, null, 'Scenario deleted successfully');
	});
}

export const scenarioController = new ScenarioController();
