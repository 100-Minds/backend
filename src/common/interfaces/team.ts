import { MemberType, StatusRequest } from '../constants';

export interface ITeam {
	id: string;
	name: string;
	ownerId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ITeamMember {
	id: string;
	teamId: string;
	userId: string;
	memberType: MemberType;
	statusRequest: StatusRequest;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ITeamInvite {
	id: string;
	teamId: string;
	inviterId: string;
	inviteeId: string;
	inviteLink: string;
	inviteLinkExpires: Date;
	linkIsUsed: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ITeamMemberWithUser extends ITeamMember {
	email: string;
	firstName: string;
	lastName: string;
	username: string;
}
