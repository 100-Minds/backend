import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { quizRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { QuizDifficulty } from '@/common/constants';

class QuizController {
	createQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId, score, difficulty } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!score) {
			throw new AppError('A Score is required for this quiz', 400);
		}

        if ((courseId && !difficulty) || (!courseId && difficulty)) {
            throw new AppError('Both courseId and difficulty must be provided together', 400);
        }

		if (difficulty && !Object.values(QuizDifficulty).includes(difficulty)) {
			throw new AppError('Invalid difficulty level. Must be beginner, intermediate, or expert', 400);
		}

		const [quiz] = await quizRepository.create({
			score,
            userId: user.id,
			...(courseId && courseId.trim() ? { courseId } : null),
			...(difficulty ? { difficulty } : null),
		});
		if (!quiz) {
			throw new AppError('Failed to create quiz', 500);
		}

		return AppResponse(res, 201, toJSON(quiz), 'Quiz created successfully');
	});

	getUserQuizScoreById = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { quizId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!quizId) {
			throw new AppError('Quiz ID is required', 400);
		}

		const quiz = await quizRepository.findById(quizId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		return AppResponse(res, 200, toJSON(quiz), 'Quiz retrieved successfully');
	});

	findAllQuizScoreByCourseId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a team', 403);
		}

		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const quiz = await quizRepository.findQuizByCourseId(courseId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		return AppResponse(res, 200, toJSON(quiz), 'All User Course Quiz retrieved successfully');
	});

	findAllQuizScoreByCourseIdAndUserId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId, userId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can view all quiz scores', 403);
		}
		if (!courseId || !userId) {
			throw new AppError('Course ID and User ID are required', 400);
		}

		const quiz = await quizRepository.findQuizByCourseAndUserId(courseId as string, userId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		return AppResponse(res, 200, toJSON(quiz), 'All User Course Quiz retrieved successfully');
	});

	findAllQuizScoreByUserId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { userId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!userId) {
			throw new AppError('User ID is required', 400);
		}

		const quiz = await quizRepository.findQuizByUserId(userId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		return AppResponse(res, 200, toJSON(quiz), 'All User Quiz retrieved successfully');
	});

	findAllUserCourseQuizScore = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { userId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!userId) {
			throw new AppError('User ID is required', 400);
		}

		const quiz = await quizRepository.findAllUserCourseQuizScores(userId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}
		return AppResponse(res, 200, toJSON(quiz), 'All User Course Quiz retrieved successfully');
	});

	updateQuizScore = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { score, quizId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a team', 403);
		}

		if (!quizId) {
			throw new AppError('Quiz ID is required', 400);
		}

		const quiz = await quizRepository.findById(quizId);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		const [updatedQuiz] = await quizRepository.update(quizId, { score });
		if (!updatedQuiz) {
			throw new AppError('Failed to update quiz', 500);
		}

		return AppResponse(res, 200, toJSON(updatedQuiz), 'Quiz updated successfully');
	});
}

export const quizController = new QuizController();
