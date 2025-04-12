import { knexDb } from '@/common/config';
import { ICourseScenario, IScenario } from '@/common/interfaces';
import { DateTime } from 'luxon';

class ScenarioRepository {
	create = async (payload: Partial<IScenario>): Promise<IScenario[]> => {
		return await knexDb.table('sys_scenario').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IScenario | null> => {
		return knexDb('sys_scenario').where({ id, isDeleted: false }).first();
	};

	findScenarioByName = async (scenarioName: string): Promise<IScenario | null> => {
		return knexDb('sys_scenario').where({ scenario: scenarioName }).select('id', 'scenario').first();
	};

	findScenariosByName = async (scenarios: string[]): Promise<IScenario[]> => {
		return knexDb('sys_scenario').whereIn('scenario', scenarios).select('id', 'scenario');
	};

	removeScenariosFromCourse = async (courseId: string): Promise<number> => {
		return await knexDb('course_roleplay').where({ courseId }).del();
	};

	addScenarioToCourse = async (
		courseId: string,
		scenarios: { id: string; name: string }[]
	): Promise<ICourseScenario[]> => {
		const payload = scenarios.map(({ id, name }) => ({
			courseId,
			scenarioId: id,
			scenarioName: name,
		}));

		return await knexDb.table('course_roleplay').insert(payload).returning('*');
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
