import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { userRepository } from '@/repository';
import { IUser } from '@/common/interfaces';

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

		return AppResponse(res, 200, toJSON(extinguishUser), 'Profile retrieved successfully');
	});

	getAllUsers = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role !== 'admin') {
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
		const allowedUpdates = ['firstName', 'lastName', 'email', 'username'];
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
}

export const userController = new UserController();
