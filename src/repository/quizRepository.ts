import { knexDb } from '@/common/config';
import { IQuiz } from '@/common/interfaces';
import { DateTime } from 'luxon';

class QuizRepository {
	create = async (payload: Partial<IQuiz>) => {
		return await knexDb.table('quiz_scores').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IQuiz | null> => {
		return await knexDb.table('quiz_scores').where({ id }).first();
	};

    findQuizByCourseId = async (courseId: string): Promise<IQuiz[] | null> => {
		return await knexDb.table('quiz_scores').where({ courseId }).select();;
	}

	findQuizByCourseAndUserId = async (courseId: string, userId: string): Promise<IQuiz[] | null> => {
		return await knexDb.table('quiz_scores').where({ courseId, userId }).select();
	};

	findQuizByUserId = async (userId: string): Promise<IQuiz[]> => {
		return await knexDb.table('quiz_scores').where({ userId }).orderBy('created_at', 'asc');
	};

	findAllUserCourseQuizScores = async (userId: string): Promise<IQuiz[]> => {
		return await knexDb.table('quiz_scores').where({ userId }).whereNotNull('courseId').select();
	};

	update = async (id: string, payload: Partial<IQuiz>): Promise<IQuiz[]> => {
		return await knexDb('quiz_scores')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('quiz_scores').orderBy('created_at', 'asc');
	};
}

export const quizRepository = new QuizRepository();
