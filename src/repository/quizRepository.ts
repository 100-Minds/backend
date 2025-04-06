import { knexDb } from '@/common/config';
import { IQuiz } from '@/common/interfaces';
import { DateTime } from 'luxon';

class QuizRepository {
	create = async (payload: Partial<IQuiz>) => {
		return await knexDb.table('quiz').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IQuiz | null> => {
		return await knexDb.table('quiz').where({ id }).first();
	};

	findQuizByChapterId = async (chapterId: string): Promise<IQuiz[] | null> => {
		return await knexDb.table('quiz').where({ chapterId }).select();
	};

	findQuizByQuestionAndChapterId = async (question: string, chapterId: string): Promise<IQuiz | null> => {
		return await knexDb.table('quiz').where({ question, chapterId }).first();
	};

	update = async (id: string, payload: Partial<IQuiz>): Promise<IQuiz[]> => {
		return await knexDb('quiz')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('quiz').orderBy('created_at', 'asc');
	};

	delete = async (id: string) => {
		return await knexDb.table('quiz').where({ id }).delete().returning('*');
	};
}

export const quizRepository = new QuizRepository();
