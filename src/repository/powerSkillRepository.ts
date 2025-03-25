import { knexDb } from '@/common/config';
import { ICoursePowerSkill, IPowerSkill } from '@/common/interfaces';
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

	findSkillsByIds = async (skills: string[]): Promise<IPowerSkill[]> => {
		return knexDb('sys_powerskill').whereIn('id', skills).select('id', 'powerskill');
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<IPowerSkill[]> => {
		return knexDb('sys_powerskill').where({ isDeleted }).orderBy('created_at', 'desc');
	};

	addPowerSkillsToCourse = async (
		courseId: string,
		powerSkills: { id: string; name: string }[]
	): Promise<ICoursePowerSkill[]> => {
		const payload = powerSkills.map(({ id, name }) => ({
			courseId,
			powerSkillId: id,
			powerSkillName: name,
		}));

		return await knexDb.table('course_power_skills').insert(payload).returning('*');
	};

	removePowerSkillsFromCourse = async (courseId: string): Promise<number> => {
		return await knexDb('course_power_skills').where({ courseId }).del();
	};

	getPowerSkillsByCourse = async (courseId: string): Promise<IPowerSkill[]> => {
		return await knexDb('power_skills')
			.join('course_power_skills', 'power_skills.id', 'course_power_skills.powerSkillId')
			.where('course_power_skills.courseId', courseId)
			.select('power_skills.*');
	};
}

export const powerSkillRepository = new PowerSkillRepository();
