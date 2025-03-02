import { knexDb } from '@/common/config';
import { IScenario } from '@/common/interfaces';
import { DateTime } from 'luxon';

class ScenarioRepository {
	create = async (payload: Partial<IScenario>): Promise<IScenario[]> => {
		return await knexDb.table('sys_scenario').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IScenario | null> => {
		return knexDb('sys_scenario').where({ id, isDeleted: false }).first();
	};

	update = async (id: string, payload: Partial<IScenario>): Promise<IScenario[]> => {
		return await knexDb('sys_scenario')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async (): Promise<IScenario[]> => {
		return knexDb('sys_scenario').where({ isDeleted: false }).orderBy('created_at', 'asc');
	};

	findOne = async (id: string): Promise<IScenario | null> => {
		return knexDb('sys_scenario').where({ id, isDeleted: false }).first();
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<IScenario[]> => {
		return knexDb('sys_scenario').where({ isDeleted }).orderBy('created_at', 'desc');
	};
}

export const scenarioRepository = new ScenarioRepository();
