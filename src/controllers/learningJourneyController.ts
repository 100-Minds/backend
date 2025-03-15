import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository, learningJourneyRepository } from '@/repository';

class LearningJourneyController {
	addLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { moduleId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can add a learning journey', 403);
		}
		if (!moduleId) {
			throw new AppError('ModuleId is required', 400);
		}

		const module = await courseRepository.getModule(moduleId);
		if (!module) {
			throw new AppError('Module not found', 404);
		}
		if (module.isDeleted) {
			throw new AppError('Module is deleted', 404);
		}

		const courses = await courseRepository.getModuleCourses(moduleId);
		if (courses.length === 0) {
			throw new AppError('No courses available in this module', 400);
		}

		const learningJourney = await learningJourneyRepository.addToLearningJourney(moduleId);
		if (!learningJourney) {
			throw new AppError('Failed to add learning journey', 500);
		}
		if (learningJourney.length === 0) {
			throw new AppError('No Course in this module', 400);
		}

		return AppResponse(res, 201, toJSON(learningJourney), 'Learning journey added successfully');
	});

	getAllLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const learningJourney = await learningJourneyRepository.getAllLearningJourney();
		if (!learningJourney) {
			throw new AppError('No learning journey found', 404);
		}
		return AppResponse(res, 200, toJSON(learningJourney), 'Learning journey retrieved successfully');
	});

	addUserLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!chapterId) {
			throw new AppError('ChapterId is required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.isDeleted) {
			throw new AppError('Chapter is deleted', 404);
		}

		const learningJourney = await learningJourneyRepository.addToUserLearningJourney(user.id, chapterId);
		if (!learningJourney) {
			throw new AppError('Failed to add learning journey', 500);
		}

		return AppResponse(res, 201, toJSON(learningJourney), 'Learning journey added successfully to user data');
	});

	getAllUserLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const learningJourney = await learningJourneyRepository.getAllUserLearningJourney(user.id);
		if (!learningJourney) {
			throw new AppError('No learning journey found', 404);
		}
		return AppResponse(res, 200, toJSON(learningJourney), 'Learning journey retrieved successfully');
	});

	getAllCourseLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const learningJourney = await learningJourneyRepository.getAllCourseLearningJourney();
		if (!learningJourney) {
			throw new AppError('No learning journey found', 404);
		}
		return AppResponse(res, 200, toJSON(learningJourney), 'Learning journey retrieved successfully');
	});

	getAllUserCourseLearningJourney = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const learningJourney = await learningJourneyRepository.getAllUserCourseLearningJourney(user.id);
		if (!learningJourney) {
			throw new AppError('No learning journey found', 404);
		}
		return AppResponse(res, 200, toJSON(learningJourney), 'Learning journey retrieved successfully');
	});
}

export const learningJourneyController = new LearningJourneyController();
