import { knexDb } from '@/common/config';
import { IAssessmentScores } from '@/common/interfaces';
import { DateTime } from 'luxon';

class AssessmentScoresRepository {
	create = async (payload: Partial<IAssessmentScores>) => {
		return await knexDb.table('assessment_scores').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IAssessmentScores | null> => {
		return await knexDb.table('assessment_scores').where({ id }).first();
	};

	findUserAssessmentScoreByCourseId = async (courseId: string, userId: string): Promise<IAssessmentScores[]> => {
		return await knexDb.table('assessment_scores').where({ courseId, userId }).first();
	};

	findAllScoresByCourseId = async (userId: string, courseId: string): Promise<IAssessmentScores[]> => {
		return await knexDb.table('assessment_scores').where({ userId, courseId }).select('assessment_scores.*');
	};

	update = async (id: string, payload: Partial<IAssessmentScores>): Promise<IAssessmentScores[]> => {
		return await knexDb('assessment_scores')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async () => {
		return await knexDb.table('assessment_scores').orderBy('created_at', 'asc');
	};
}

export const assessmentScoresRepository = new AssessmentScoresRepository();
