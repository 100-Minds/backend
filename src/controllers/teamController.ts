import { Request, Response } from 'express';
import {
	AppResponse,
	AppError,
	toJSON,
	createToken,
	generateRandomString,
	getDomainReferer,
	verifyToken,
	sendTeamInviteEmail,
	sendTeamInviteSuccessEmail,
	removeTeamMemberEmail,
} from '@/common/utils';
import { teamRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/repository';
import { DateTime } from 'luxon';
import { MemberType, StatusRequest } from '@/common/constants';

class TeamController {
	createTeam = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a team', 403);
		}

		if (!name) {
			throw new AppError('Team name is required', 400);
		}

		const extinguishTeam = await teamRepository.getTeamByName(user.id, name);
		if (extinguishTeam) {
			throw new AppError('Team name exist already', 400);
		}

		const [team] = await teamRepository.createTeam({ name, ownerId: user.id });

		if (!team) {
			throw new AppError('Failed to create team', 500);
		}

		await teamRepository.addTeamMember({
			teamId: team.id,
			userId: user.id,
			memberType: MemberType.Owner,
			statusRequest: StatusRequest.ACCEPTED,
		});

		return AppResponse(res, 201, toJSON([team]), 'Team created successfully');
	});

	getUserTeams = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can own a team', 403);
		}

		const team = await teamRepository.getUserTeams(user.id);

		return AppResponse(res, 200, toJSON(team), 'User teams successfully fetched');
	});

	getTeam = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { teamId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can own a team', 403);
		}

		const team = await teamRepository.getTeam(teamId as string);
		if (!team) {
			throw new AppError('Team not found', 404);
		}

		return AppResponse(res, 200, toJSON([team]), 'User team successfully fetched');
	});

	updateTeam = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, teamId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a team', 403);
		}

		if (!teamId || !name) {
			throw new AppError('Incomplete update data', 400);
		}

		const team = await teamRepository.getTeam(teamId as string);
		if (!team) {
			throw new AppError('Team not found', 404);
		}

		if (team.ownerId !== user.id) {
			throw new AppError('You are not authorized to update this team name', 403);
		}

		if (team.isDeleted) {
			throw new AppError('Team has already been deleted', 400);
		}

		const updatedTeam = await teamRepository.updateTeam(teamId, { name });

		return AppResponse(res, 200, toJSON(updatedTeam), 'Team updated successfully');
	});

	deleteTeam = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { teamId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a team', 403);
		}

		if (!teamId) {
			throw new AppError('Team ID is required', 400);
		}

		const team = await teamRepository.getTeam(teamId as string);
		if (!team) {
			throw new AppError('Team not found', 404);
		}

		if (team.ownerId !== user.id) {
			throw new AppError('You are not authorized to delete this team', 403);
		}

		if (team.isDeleted) {
			throw new AppError('Team has already been deleted', 400);
		}

		await teamRepository.deleteTeam(teamId as string);

		return AppResponse(res, 200, null, 'Team deleted successfully');
	});
	createInvite = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { teamId, email } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can invite to a team', 403);
		}

		if (!teamId || !email) {
			throw new AppError('Team ID and email are required', 400);
		}

		const team = await teamRepository.getTeam(teamId);
		if (!team) {
			throw new AppError('Team not found', 404);
		}
		if (team.ownerId !== user.id) {
			throw new AppError('You are not authorized to invite to this team', 403);
		}
		if (team.isDeleted) {
			throw new AppError('Cannot invite to a deleted team', 400);
		}

		const invitee = await userRepository.findByEmail(email);
		if (!invitee) {
			throw new AppError('Invitee not found', 404);
		}
		if (team.ownerId === invitee.id) {
			throw new AppError('You cannot invite yourself to the team', 400);
		}

		const inviteLink = await generateRandomString();
		const hashedInviteLink = createToken(
			{
				token: inviteLink,
			},
			{ expiresIn: '7d' }
		);

		//console.log(hashedInviteLink);

		const invite = await teamRepository.createTeamInvite({
			teamId,
			inviterId: user.id,
			inviteeId: invitee.id,
			inviteLink,
			inviteLinkExpires: DateTime.now().plus({ days: 7 }).toJSDate(),
			linkIsUsed: false,
		});

		const existingMember = await teamRepository.findByTeamAndUser(teamId, invitee.id);
		if (!existingMember) {
			await teamRepository.addTeamMember({
				teamId,
				userId: invitee.id,
			});
		}

		const inviteUrl = `${getDomainReferer(req)}/join-team?invite=${hashedInviteLink}`;
		//console.log(inviteUrl);
		await sendTeamInviteEmail(email, user.firstName, invitee.firstName, team.name, inviteUrl);

		return AppResponse(res, 201, toJSON(invite), `Invite link sent to ${email}`);
	});

	joinTeam = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { inviteLink } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!inviteLink) {
			throw new AppError('Invite link is required', 400);
		}

		const decodedTokenLink = await verifyToken(inviteLink as string);

		if (!decodedTokenLink.token) {
			throw new AppError('Invalid token link', 401);
		}

		const invite = await teamRepository.findByInviteLink(decodedTokenLink.token);
		if (!invite) {
			throw new AppError('Invalid or expired invite link', 404);
		}
		if (invite.inviteeId !== user.id) {
			throw new AppError('You are not authorized to join this team', 403);
		}
		if (invite.linkIsUsed) {
			throw new AppError('Invite link has already been used', 400);
		}
		if (invite.inviteLinkExpires < DateTime.now().toJSDate()) {
			throw new AppError('Invite link has expired', 400);
		}

		const team = await teamRepository.getTeam(invite.teamId);
		if (!team || team.isDeleted) {
			throw new AppError('Team not found or deleted', 404);
		}

		//just for emailing
		const teamOwner = await userRepository.findById(team.ownerId);
		if (!teamOwner) {
			throw new AppError('Team owner not found', 404);
		}

		const existingMember = await teamRepository.findByTeamAndUser(invite.teamId, user.id);
		if (!existingMember) {
			throw new AppError('Team member not found', 404);
		}

		if (existingMember.statusRequest === StatusRequest.ACCEPTED) {
			throw new AppError('You are already a member of this team', 400);
		}

		await teamRepository.updateTeamMember(invite.teamId, user.id, {
			statusRequest: StatusRequest.ACCEPTED,
		});
		await teamRepository.updateInvitationRequest(invite.id, { linkIsUsed: true });

		await sendTeamInviteSuccessEmail(user.email, teamOwner.firstName, user.firstName, team.name);

		return AppResponse(res, 200, null, 'You have successfully joined the team');
	});

	removeTeamMember = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { teamId, memberId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role !== 'admin') {
			throw new AppError('Only an admin can remove team members', 403);
		}

		if (!teamId || !memberId) {
			throw new AppError('Team ID and Member ID are required', 400);
		}

		const invitee = await userRepository.findById(memberId);
		if (!invitee) {
			throw new AppError('User not found', 404);
		}

		const team = await teamRepository.getTeam(teamId);
		if (!team || team.isDeleted) {
			throw new AppError('Team not found or deleted', 404);
		}

		if (team.ownerId !== user.id) {
			throw new AppError('Only the team owner can remove members', 403);
		}

		const member = await teamRepository.findByTeamAndUser(teamId, memberId);
		if (!member || member.isDeleted) {
			throw new AppError('Member not found or already removed', 404);
		}

		await teamRepository.updateTeamMember(teamId, member.userId, { isDeleted: true });

		await removeTeamMemberEmail(invitee.email, user.firstName, invitee.firstName, team.name);

		return AppResponse(res, 200, null, 'Team member removed successfully');
	});

	getTeamMembers = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { teamId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (!teamId) {
			throw new AppError('Team ID is required', 400);
		}

		const team = await teamRepository.getTeam(teamId as string);
		if (!team || team.isDeleted) {
			throw new AppError('Team not found or deleted', 404);
		}

		// Restrict to team owner or admin
		//check for the requirements to view team members
		if (team.ownerId !== user.id && user.role !== 'admin') {
			throw new AppError('You are not authorized to view this team’s members', 403);
		}

		const members = await teamRepository.getTeamMembers(teamId as string);

		return AppResponse(res, 200, toJSON(members), 'User team members successfully fetched');
	});
}

export const teamController = new TeamController();
