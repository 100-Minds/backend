import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, quizRepository, quizScoresRepository } from '@/repository';
import { catchAsync } from '@/middlewares';

class QuizSoresController {
	submitChapterQuiz = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId, answers } = req.body;

		if (!user) throw new AppError('Please log in again', 401);
		if (!chapterId || !courseId || !Array.isArray(answers) || answers.length === 0) {
			throw new AppError('Chapter ID, Course ID and answers are required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.courseId !== courseId) {
			throw new AppError('Chapter does not belong to the specified course', 400);
		}

		const quiz = await quizRepository.findQuizByChapterId(chapterId);
		if (!quiz || quiz.length === 0) {
			throw new AppError('No quiz found for this chapter', 404);
		}

		const existingScore = await quizScoresRepository.findUserQuizScoreByChapterId(chapterId, user.id);
		if (existingScore) {
			throw new AppError('You have already attempted this chapter quiz', 400);
		}

		let correctCount = 0;
		const totalQuestions = quiz.length;

		for (const q of quiz) {
			type Answer = { quizId: string; selectedOption: string };
			const userAnswer = answers.find((a: Answer) => a.quizId === q.id);
			if (userAnswer && userAnswer.selectedOption === q.isCorrect) {
				correctCount++;
			}
		}

		const averageScore = Math.round((correctCount / totalQuestions) * 100);

		const [score] = await quizScoresRepository.create({
			userId: user.id,
			chapterId,
			courseId,
			quizId: null,
			score: averageScore,
		});

		return AppResponse(res, 200, toJSON([score]), 'Quiz submitted successfully');
	});

	findUserQuizScoreByChapterId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!chapterId) {
			throw new AppError('Chapter ID is required', 400);
		}

		const quizScore = await quizScoresRepository.findUserQuizScoreByChapterId(chapterId as string, user.id);
		if (!quizScore) {
			throw new AppError('Quiz Score not found', 404);
		}

		return AppResponse(res, 200, toJSON([quizScore]), 'User Quiz score retrieved successfully');
	});

	findAverageScoreByCourseId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID are required', 400);
		}

		const quizScores = await quizScoresRepository.findAllScoresByCourseId(user.id, courseId as string);
		if (!quizScores || quizScores.length === 0) {
			throw new AppError('No quiz scores found for this course', 404);
		}

		const totalScore = quizScores.reduce((acc, score) => acc + score.score, 0);
		const averageScore = Math.round(totalScore / quizScores.length);

		return AppResponse(res, 200, toJSON({ averageScore }), 'Average course score retrieved successfully');
	});
}

export const quizScoresController = new QuizSoresController();
