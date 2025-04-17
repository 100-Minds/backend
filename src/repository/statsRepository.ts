import { knexDb } from '@/common/config';
import { Statistics } from '@/common/interfaces';

class StatsRepository {
	findStats = async (): Promise<Statistics> => {
		const totalUsers = await knexDb('users').where({ isDeleted: false }).count('* as count').first();
		const totalRolePlay = await knexDb('sys_scenario').where({ isDeleted: false }).count('* as count').first();
		const totalTeams = await knexDb('teams').where({ isDeleted: false }).count('* as count').first();
		const totalPowerSkill = await knexDb('sys_powerskill').where({ isDeleted: false }).count('* as count').first();
		const totalLearningJourney = await knexDb('learning_journey').count('* as count').first();
		const totalCourses = await knexDb('course').where({ isDeleted: false }).count('* as count').first();

		return {
			totalUsers: Number(totalUsers?.count) || 0,
			totalRolePlay: Number(totalRolePlay?.count) || 0,
			totalTeams: Number(totalTeams?.count) || 0,
			totalPowerSkill: Number(totalPowerSkill?.count) || 0,
			totalLearningJourney: Number(totalLearningJourney?.count) || 0,
			totalCourses: Number(totalCourses?.count) || 0,
		};
	};
}

export const statsRepository = new StatsRepository();
