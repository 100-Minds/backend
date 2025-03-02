import { knexDb } from '@/common/config';
import { ITeam, ITeamMember, ITeamInvite, ITeamMemberWithUser } from '@/common/interfaces';
import { DateTime } from 'luxon';

class TeamRepository {
	createTeam = async (payload: Partial<ITeam>) => {
		return await knexDb.table('teams').insert(payload).returning('*');
	};

	getTeam = async (teamId: string): Promise<ITeam | null> => {
		const result = await knexDb.table('teams').where({ id: teamId }).select('*');
		return result.length ? result[0] : null;
	};

	getTeamByName = async (ownerId: string, name: string): Promise<ITeam | null> => {
		return await knexDb.table('teams').where({ ownerId, name }).first();
	};

	getUserTeams = async (ownerId: string): Promise<ITeam[]> => {
		return await knexDb.table('teams').where({ ownerId }).andWhere({ isDeleted: false }).select('*');
	};

	deleteTeam = async (teamId: string) => {
		return await knexDb.table('teams').where({ id: teamId }).update({ isDeleted: true }).returning('*');
	};

	updateTeam = async (id: string, payload: Partial<ITeam>): Promise<ITeam[]> => {
		return await knexDb
			.table('teams')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	//////////////TEAM MEMBERS////////////////////
	addTeamMember = async (payload: Partial<ITeamMember>) => {
		return await knexDb.table('team_members').insert(payload).returning('*');
	};

	getTeamMembers = async (teamId: string): Promise<ITeamMemberWithUser[]> => {
		return await knexDb
			.table('team_members')
			.join('users', 'team_members.userId', 'users.id')
			.select(
				'team_members.id',
				'team_members.teamId',
				'team_members.userId',
				'team_members.memberType',
				'team_members.statusRequest',
				'team_members.isDeleted',
				'team_members.created_at',
				'team_members.updated_at',
				'users.email',
				'users.firstName',
				'users.lastName',
				'users.username'
			)
			.where('team_members.teamId', teamId)
			.where('team_members.isDeleted', false);
	};

	findByTeamAndUser = async (teamId: string, userId: string): Promise<ITeamMember | null> => {
		return await knexDb.table('team_members').where({ teamId, userId, isDeleted: false }).first();
	};

	updateTeamMember = async (teamId: string, userId: string, payload: Partial<ITeamMember>): Promise<ITeamMember[]> => {
		return await knexDb
			.table('team_members')
			.where({ teamId, userId })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	deleteTeamMember = async (teamId: string, userId: string) => {
		return await knexDb
			.table('team_members')
			.where({ teamId })
			.andWhere({ userId })
			.update({ isDeleted: true })
			.returning('*');
	};

	//////////////TEAM INVITES////////////////////
	createTeamInvite = async (payload: Partial<ITeamInvite>): Promise<ITeamInvite[]> => {
		return await knexDb.table('team_invites').insert(payload).returning('*');
	};

	findByInviteLink = async (inviteLink: string): Promise<ITeamInvite | null> => {
		return await knexDb
			.table('team_invites')
			.where({ inviteLink })
			.where('inviteLinkExpires', '>', DateTime.now().toJSDate())
			.first();
	};

	updateInvitationRequest = async (id: string, payload: Partial<ITeamInvite>): Promise<ITeamInvite[]> => {
		return await knexDb
			.table('team_invites')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};
}

export const teamRepository = new TeamRepository();
