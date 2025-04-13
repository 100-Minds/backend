import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, assessmentRepository, assessmentScoresRepository } from '@/repository';
import { catchAsync } from '@/middlewares';

class AssessmentScoresController {
	submitCourseAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId, assessmentAnswers } = req.body;

		if (!user) throw new AppError('Please log in again', 401);
		if (!courseId || !Array.isArray(assessmentAnswers) || assessmentAnswers.length === 0) {
			throw new AppError('Course ID and assessment answers are required', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const assessment = await assessmentRepository.findAssessmentByCourseId(courseId);
		if (!assessment || assessment.length === 0) {
			throw new AppError('No assessment found for this course', 404);
		}

		const existingScore = await assessmentScoresRepository.findUserAssessmentScoreByCourseId(courseId, user.id);
		if (existingScore) {
			throw new AppError('You have already attempted this course assessment', 400);
		}

		let correctCount = 0;
		const totalQuestions = assessment.length;

		for (const q of assessment) {
			type Answer = { assessmentId: string; selectedOption: string };
			const userAnswer = assessmentAnswers.find((a: Answer) => a.assessmentId === q.id);
			if (userAnswer && userAnswer.selectedOption === q.isCorrect) {
				correctCount++;
			}
		}

		const averageScore = Math.round((correctCount / totalQuestions) * 100);

		const [score] = await assessmentScoresRepository.create({
			userId: user.id,
			courseId,
			assessmentId: null,
			score: averageScore,
		});

		return AppResponse(res, 200, toJSON([score]), 'Assessment submitted successfully');
	});

	findUserAssessmentScoreByCourseId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const assessmentScore = await assessmentScoresRepository.findUserAssessmentScoreByCourseId(
			courseId as string,
			user.id
		);
		if (!assessmentScore) {
			throw new AppError('Assessment Score not found', 404);
		}

		return AppResponse(res, 200, toJSON([assessmentScore]), 'User Assessment score retrieved successfully');
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

		const assessmentScores = await assessmentScoresRepository.findAllScoresByCourseId(user.id, courseId as string);
		if (!assessmentScores || assessmentScores.length === 0) {
			throw new AppError('No assessment scores found for this course', 404);
		}

		const totalScore = assessmentScores.reduce((acc, score) => acc + score.score, 0);
		const averageScore = Math.round(totalScore / assessmentScores.length);

		return AppResponse(res, 200, toJSON({ averageScore }), 'Average course score retrieved successfully');
	});
}

export const assessmentScoresController = new AssessmentScoresController();
