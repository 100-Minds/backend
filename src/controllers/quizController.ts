import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, quizRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { IQuiz } from '@/common/interfaces';

class QuizController {
	createQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { question, chapterId, courseId, optionA, optionB, optionC, optionD, isCorrect } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create quiz', 403);
		}

		const validOptions = {
			optionA,
			optionB,
			optionC,
			optionD,
		};
		if (!question) {
			throw new AppError('Question is required', 400);
		}
		if (!chapterId) {
			throw new AppError('Chapter ID is required', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}
		if (!validOptions.optionA) {
			throw new AppError('Option A is required', 400);
		}
		if (!validOptions.optionB) {
			throw new AppError('Option B is required', 400);
		}
		if (!isCorrect) {
			throw new AppError('Correct answer is required', 400);
		}
		const providedOptions = Object.entries(validOptions)
			.filter(([, value]) => typeof value === 'string' && value.trim() !== '')
			.map(([key]) => key);
		if (!providedOptions.includes(isCorrect)) {
			throw new AppError(`Correct answer must match one of the provided options: ${providedOptions.join(', ')}`, 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) throw new AppError('Chapter not found', 404);
		if (chapter.courseId !== courseId) {
			throw new AppError('Chapter does not belong to the specified course', 400);
		}

		const questionExist = await quizRepository.findQuizByQuestionAndChapterId(question, chapterId);
		if (questionExist) {
			throw new AppError('Question already exists', 400);
		}

		const [quiz] = await quizRepository.create({
			question,
			chapterId,
			courseId,
			optionA,
			optionB,
			...(validOptions.optionC && validOptions.optionC ? { optionC: validOptions.optionC } : null),
			...(validOptions.optionA && validOptions.optionD ? { optionD: validOptions.optionD } : null),
			isCorrect,
		});
		if (!quiz) {
			throw new AppError('Failed to create quiz', 500);
		}

		return AppResponse(res, 201, toJSON([quiz]), 'Quiz created successfully');
	});

	findById = catchAsync(async (req: Request, res: Response) => {
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

		return AppResponse(res, 200, toJSON([quiz]), 'Quiz retrieved successfully');
	});

	findQuizByChapterId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!chapterId) {
			throw new AppError('Chapter ID is required', 400);
		}

		const quiz = await quizRepository.findQuizByChapterId(chapterId as string);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		return AppResponse(res, 200, toJSON(quiz), 'Chapters Quiz retrieved successfully');
	});

	updateQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { quizId, question, chapterId, optionA, optionB, optionC, optionD, isCorrect } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a quiz', 403);
		}
		if (!quizId) {
			throw new AppError('Quiz ID is required', 400);
		}

		const quiz = await quizRepository.findById(quizId);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		const updatedOptions = {
			optionA: optionA ?? quiz.optionA,
			optionB: optionB ?? quiz.optionB,
			optionC: optionC ?? null,
			optionD: optionD ?? null,
		};

		const availableOptions = ['optionA', 'optionB'];
		if (updatedOptions.optionC) availableOptions.push('optionC');
		if (updatedOptions.optionD) availableOptions.push('optionD');
		if (!availableOptions.includes(isCorrect)) {
			throw new AppError(`Correct answer must be one of the provided options: ${availableOptions.join(', ')}`, 400);
		}

		const updatedQuizData: IQuiz = {
			...(question && { question }),
			...(chapterId && { chapterId }),
			optionA: updatedOptions.optionA,
			optionB: updatedOptions.optionB,
			optionC: updatedOptions.optionC,
			optionD: updatedOptions.optionD,
			isCorrect,
		};
		if (Object.keys(updatedQuizData).length === 0) {
			throw new AppError('No fields to update', 400);
		}

		const [updatedQuiz] = await quizRepository.update(quizId, updatedQuizData);
		if (!updatedQuiz) {
			throw new AppError('Failed to update quiz', 500);
		}

		return AppResponse(res, 200, toJSON([updatedQuiz]), 'Quiz updated successfully');
	});

	deleteQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { quizId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a quiz', 403);
		}
		if (!quizId) {
			throw new AppError('Quiz ID is required', 400);
		}

		const quiz = await quizRepository.findById(quizId);
		if (!quiz) {
			throw new AppError('Quiz not found', 404);
		}

		const deletedQuiz = await quizRepository.delete(quizId);
		if (!deletedQuiz) {
			throw new AppError('Failed to delete quiz', 500);
		}

		return AppResponse(res, 200, null, 'Quiz deleted successfully');
	});
}

export const quizController = new QuizController();
