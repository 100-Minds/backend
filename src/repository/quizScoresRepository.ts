import { knexDb } from '@/common/config';
import { IQuizScores } from '@/common/interfaces';
import { DateTime } from 'luxon';

class QuizScoresRepository {
	create = async (payload: Partial<IQuizScores>) => {
		return await knexDb.table('quiz_scores').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IQuizScores | null> => {
		return await knexDb.table('quiz_scores').where({ id }).first();
	};

	findUserQuizScoreByChapterId = async (chapterId: string, userId: string): Promise<IQuizScores[]> => {
		return await knexDb.table('quiz_scores').where({ chapterId, userId }).first();
	};

	findAllScoresByCourseId = async (userId: string, courseId: string): Promise<IQuizScores[]> => {
		return await knexDb.table('quiz_scores').where({ userId, courseId }).select('quiz_scores.*');
	};

	update = async (id: string, payload: Partial<IQuizScores>): Promise<IQuizScores[]> => {
		return await knexDb('quiz_scores')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('quiz_scores').orderBy('created_at', 'asc');
	};
}

export const quizScoresRepository = new QuizScoresRepository();
