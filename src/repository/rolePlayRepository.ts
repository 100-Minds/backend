import { knexDb } from '@/common/config';
import { IRolePlay } from '@/common/interfaces';
import { DateTime } from 'luxon';

class RolePlayRepository {
	create = async (payload: Partial<IRolePlay>): Promise<IRolePlay[]> => {
		// if (!payload.userId || !payload.scenarioId) {
		// 	throw new Error('User ID and scenario ID are required for role_play creation');
		// }

		// const scenarioExists = await scenarioRepository.findById(payload.scenarioId);

		// if (!scenarioExists) {
		// 	throw new Error('Invalid or deleted scenario ID');
		// }

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

	findAll = async (): Promise<IRolePlay[]> => {
		return knexDb('role_play').where({ isDeleted: false }).orderBy('created_at', 'desc');
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<IRolePlay[]> => {
		return knexDb('role_play').where({ isDeleted }).orderBy('created_at', 'desc');
	};
}

export const rolePlayRepository = new RolePlayRepository();
