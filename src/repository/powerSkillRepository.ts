import { knexDb } from '@/common/config';
import { IPowerSkill } from '@/common/interfaces';
import { DateTime } from 'luxon';

class PowerSkillRepository {
	create = async (payload: Partial<IPowerSkill>): Promise<IPowerSkill[]> => {
		return await knexDb.table('sys_powerskill').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IPowerSkill | null> => {
		return knexDb('sys_powerskill').where({ id, isDeleted: false }).first();
	};

	update = async (id: string, payload: Partial<IPowerSkill>): Promise<IPowerSkill[]> => {
		return await knexDb('sys_powerskill')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async (): Promise<IPowerSkill[]> => {
		return knexDb('sys_powerskill').where({ isDeleted: false }).orderBy('created_at', 'asc');
	};

	findOne = async (id: string): Promise<IPowerSkill | null> => {
		return knexDb('sys_powerskill').where({ id, isDeleted: false }).first();
	};

	findBySkillName = async (skill: string): Promise<IPowerSkill | null> => {
		return knexDb('sys_powerskill').where({ powerskill: skill, isDeleted: false }).first();
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<IPowerSkill[]> => {
		return knexDb('sys_powerskill').where({ isDeleted }).orderBy('created_at', 'desc');
	};
}

export const powerSkillRepository = new PowerSkillRepository();
