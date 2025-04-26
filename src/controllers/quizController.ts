import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, quizRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { IQuiz } from '@/common/interfaces';

class QuizController {
	createQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { question, chapterId, courseId, optionA, optionB, optionC, optionD, optionE, isCorrect } = req.body;

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
			optionE,
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
		if (!isCorrect || !Array.isArray(isCorrect) || isCorrect.length === 0) {
			throw new AppError('At least one correct answer is required', 400);
		}

		// Get available options that have values
		const providedOptions = Object.entries(validOptions)
			.filter(([, value]) => typeof value === 'string' && value.trim() !== '')
			.map(([key]) => key);

		// Validate that all correct answers are among the provided options
		const invalidAnswers = isCorrect.filter((answer) => !providedOptions.includes(answer));
		if (invalidAnswers.length > 0) {
			throw new AppError(
				`Correct answers must match the provided options. Invalid options: ${invalidAnswers.join(', ')}`,
				400
			);
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
			...(validOptions.optionC && { optionC: validOptions.optionC }),
			...(validOptions.optionD && { optionD: validOptions.optionD }),
			...(validOptions.optionE && { optionE: validOptions.optionE }),
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
		const { quizId, question, chapterId, optionA, optionB, optionC, optionD, optionE, isCorrect } = req.body;

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

		///ee
		const questionExist = await quizRepository.findQuizByQuestionAndChapterId(question, chapterId);
		if (questionExist) {
			throw new AppError('Question already exists', 400);
		}

		const updatedOptions = {
			optionA: optionA ?? quiz.optionA,
			optionB: optionB ?? quiz.optionB,
			optionC: optionC ?? quiz.optionC ?? null,
			optionD: optionD ?? quiz.optionD ?? null,
			optionE: optionE ?? quiz.optionE ?? null,
		};

		const availableOptions = ['optionA', 'optionB'];
		if (updatedOptions.optionC) availableOptions.push('optionC');
		if (updatedOptions.optionD) availableOptions.push('optionD');
		if (updatedOptions.optionE) availableOptions.push('optionE');

		///e
		let correctAnswers = isCorrect;
		if (correctAnswers) {
			if (!Array.isArray(correctAnswers)) {
				correctAnswers = [correctAnswers];
			}

			const invalidAnswers: string[] = correctAnswers.filter((answer: string) => !availableOptions.includes(answer));
			if (invalidAnswers.length > 0) {
				throw new AppError(
					`Correct answers must be from the provided options. Invalid options: ${invalidAnswers.join(', ')}. Available options: ${availableOptions.join(', ')}`,
					400
				);
			}
		} else {
			correctAnswers = quiz.isCorrect;
		}


		///e
		const updatedQuizData: Partial<IQuiz> = {
			...(question && { question }),
			...(chapterId && { chapterId }),
			optionA: updatedOptions.optionA,
			optionB: updatedOptions.optionB,
			optionC: updatedOptions.optionC,
			optionD: updatedOptions.optionD,
			optionE: updatedOptions.optionE,
			isCorrect: correctAnswers,
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
