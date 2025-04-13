import { knexDb } from '@/common/config';
import { IAssessment } from '@/common/interfaces';
import { DateTime } from 'luxon';

class AssessmentRepository {
	create = async (payload: Partial<IAssessment>) => {
		return await knexDb.table('assessment').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IAssessment | null> => {
		return await knexDb.table('assessment').where({ id }).first();
	};

	findAssessmentByCourseId = async (courseId: string): Promise<IAssessment[] | null> => {
		return await knexDb.table('assessment').where({ courseId }).select();
	};

	findAssessmentByQuestionAndCourseId = async (question: string, courseId: string): Promise<IAssessment | null> => {
		return await knexDb.table('assessment').where({ question, courseId }).first();
	};

	update = async (id: string, payload: Partial<IAssessment>): Promise<IAssessment[]> => {
		return await knexDb('assessment')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('assessment').orderBy('created_at', 'asc');
	};

	delete = async (id: string) => {
		return await knexDb.table('assessment').where({ id }).delete().returning('*');
	};
}

export const assessmentRepository = new AssessmentRepository();
