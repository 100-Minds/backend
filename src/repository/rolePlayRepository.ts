import { knexDb } from '@/common/config';
import { IRolePlay } from '@/common/interfaces';
import { DateTime } from 'luxon';

class RolePlayRepository {
	create = async (payload: Partial<IRolePlay>): Promise<IRolePlay[]> => {
		return await knexDb.table('role_play').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IRolePlay | null> => {
		return knexDb('role_play').where({ id, isDeleted: false }).first();
	};

	update = async (id: string, payload: Partial<IRolePlay>): Promise<IRolePlay[]> => {
		return await knexDb('role_play')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findByUserId = async (userId: string): Promise<IRolePlay[]> => {
		return knexDb('role_play').where({ userId, isDeleted: false }).orderBy('created_at', 'desc');
	};

	findByScenarioId = async (scenarioId: string): Promise<IRolePlay> => {
		return knexDb('role_play').where({ scenarioId, isDeleted: false }).first();
	};

	findByScenarioIdAndUserId = async (scenarioId: string, userId: string): Promise<IRolePlay> => {
		return knexDb('role_play').where({ scenarioId, userId, isDeleted: false }).first();
	};

	findAll = async (): Promise<IRolePlay[]> => {
		return knexDb('role_play').where({ isDeleted: false }).orderBy('created_at', 'desc');
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<IRolePlay[]> => {
		return knexDb('role_play').where({ isDeleted }).orderBy('created_at', 'desc');
	};
}

export const rolePlayRepository = new RolePlayRepository();
