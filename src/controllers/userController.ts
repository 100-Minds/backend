import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadPictureFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/repository';
import { IUser } from '@/common/interfaces';
import { Role } from '@/common/constants';

export class UserController {
	getProfile = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const extinguishUser = await userRepository.findById(user.id);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		return AppResponse(res, 200, toJSON([extinguishUser]), 'Profile retrieved successfully');
	});

	getAllUsers = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 401);
		}

		if (user.role === 'user') {
			throw new AppError('Only admins can view all users', 403);
		}

		const extinguishUsers = await userRepository.findAll();
		if (!extinguishUsers) {
			throw new AppError('No users found', 404);
		}

		return AppResponse(res, 200, toJSON(extinguishUsers), 'Users retrieved successfully');
	});

	updateProfile = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const allowedUpdates = [
			'firstName',
			'lastName',
			'email',
			'username',
			'bio',
			'careerGoals',
			'opportunities',
			'strengths',
		];
		const updates = Object.keys(req.body);

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
		if (!isValidOperation) {
			throw new AppError('Invalid update fields!', 400);
		}

		const updateData: Partial<IUser> = {};
		updates.forEach((update) => {
			if (req.body[update]) {
				updateData[update] = req.body[update];
			}
		});

		if (Object.keys(updateData).length === 0) {
			throw new AppError('No valid fields to update', 400);
		}

		const updateProfile = await userRepository.update(user.id, updateData);
		if (!updateProfile) {
			throw new AppError('Failed to update profile', 500);
		}

		return AppResponse(res, 200, toJSON(updateProfile), 'Profile updated successfully');
	});

	updateUserAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { userId, assessment } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role == 'user') {
			throw new AppError('Only admins can update user assessment', 403);
		}
		if (!userId) {
			throw new AppError('User ID is required', 400);
		}
		if (!assessment) {
			throw new AppError('Assessment is required', 400);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const updateUserAssessment = await userRepository.update(userId, {
			assessment,
		});
		if (!updateUserAssessment) {
			throw new AppError('Failed to update user assessment', 500);
		}

		return AppResponse(res, 200, toJSON(updateUserAssessment), 'User assessment updated successfully');
	});

	updateLogo = catchAsync(async (req: Request, res: Response) => {
		const { user, file } = req;
		const { userId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role == 'user') {
			throw new AppError('Only admins can update user logo', 403);
		}
		if (!userId) {
			throw new AppError('User ID is required', 400);
		}
		if (!file) {
			throw new AppError('Logo is required', 400);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const { secureUrl: organizationLogo } = await uploadPictureFile({
			fileName: `organization-logo/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const updateUserLogo = await userRepository.update(userId, {
			organizationLogo,
		});
		if (!updateUserLogo) {
			throw new AppError('Failed to update user logo', 500);
		}

		return AppResponse(res, 200, toJSON(updateUserLogo), 'User logo updated successfully');
	});

	updateOrganizationalAccount = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { file } = req;
		const { organizationName, organizationWebsite, organizationDescription, showLogo } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.accountType !== 'organization') {
			throw new AppError('Only organizational accounts can update their account', 403);
		}

		const organizationData: Partial<IUser> = {
			organizationName,
			organizationWebsite,
			organizationDescription,
			showLogo,
		};
		if (organizationName) organizationData.organizationName = organizationName;
		if (file) {
			const { secureUrl } = await uploadPictureFile({
				fileName: `organization-logo/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});
			organizationData.organizationLogo = secureUrl;
		}
		if (organizationWebsite) organizationData.organizationWebsite = organizationWebsite;
		if (organizationDescription) organizationData.organizationDescription = organizationDescription;
		if (showLogo !== undefined) {
			organizationData.showLogo = showLogo === 'true' ? true : showLogo === 'false' ? false : Boolean(showLogo);
		}

		const updateOrganization = await userRepository.update(user.id, organizationData);
		if (!updateOrganization) {
			throw new AppError('Failed to update organization data', 500);
		}

		return AppResponse(res, 200, toJSON(updateOrganization), 'Organization updated successfully');
	});

	uploadProfilePicture = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!file) {
			throw new AppError('File is required', 400);
		}

		const extinguishUser = await userRepository.findById(user.id as string);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const { secureUrl } = await uploadPictureFile({
			fileName: `profile-picture/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const updateProfile = await userRepository.update(user.id, {
			photo: secureUrl,
		});
		if (!updateProfile) {
			throw new AppError('Failed to update profile picture', 500);
		}

		return AppResponse(res, 200, toJSON(updateProfile), 'Profile picture updated successfully');
	});

	suspendUser = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { suspend, userId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 401);
		}
		if (user.role === 'user') {
			throw new AppError('Only admins can modify user data', 403);
		}
		if (user.id === userId) {
			throw new AppError('You cant perform this operation on your account', 403);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const suspendUser = await userRepository.update(userId, {
			isSuspended: suspend ? true : false,
		});
		if (!suspendUser) {
			throw new AppError(`Failed to ${suspend ? 'suspend' : 'un suspend'} user`, 500);
		}

		return AppResponse(res, 200, null, `User ${suspend ? 'suspended' : 'unsuspended'} successfully`);
	});

	makeAdmin = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { makeAdmin, userId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 401);
		}
		if (user.role === 'user') {
			throw new AppError('Only admins can assign admin roles', 403);
		}
		if (user.id === userId) {
			throw new AppError('You cant perform this operation on your account', 403);
		}

		const extinguishUser = await userRepository.findById(userId);
		if (!extinguishUser) {
			throw new AppError('User not found', 404);
		}

		const suspendUser = await userRepository.update(userId, {
			role: makeAdmin ? Role.Admin : Role.User,
		});
		if (!suspendUser) {
			throw new AppError(`Failed to ${makeAdmin ? 'promote' : 'demote'} user`, 500);
		}

		return AppResponse(res, 200, null, `User ${makeAdmin ? 'promoted' : 'demoted'} successfully`);
	});
}

export const userController = new UserController();
