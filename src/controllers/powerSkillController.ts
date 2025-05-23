import { Request, Response } from 'express';
import { AppError, AppResponse, toJSON, uploadVideoFile } from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { powerSkillRepository } from '@/repository';
import { IPowerSkill } from '@/common/interfaces';

export class PowerSkillController {
	createPowerSkill = catchAsync(async (req: Request, res: Response) => {
		const { skill, category } = req.body;
		const { user, file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create a power skill', 403);
		}
		if (!skill) {
			throw new AppError('Skill is required', 400);
		}
		if (!file) {
			throw new AppError('Power skill image is required', 400);
		}
		if (!category) {
			throw new AppError('Category is required', 400);
		}

		const existingSkill = await powerSkillRepository.findBySkillName(skill);
		if (existingSkill) {
			throw new AppError('Power skill already exists', 400);
		}

		const { secureUrl: skillImage } = await uploadVideoFile({
			fileName: `skill-video/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const [createdPowerSkill] = await powerSkillRepository.create({
			powerskill: skill,
			skillImage,
			category,
		});
		if (!createdPowerSkill) {
			throw new AppError('Failed to create power skill', 500);
		}

		return AppResponse(res, 201, toJSON([createdPowerSkill]), 'Power skill created successfully');
	});

	findOne = catchAsync(async (req: Request, res: Response) => {
		const { skillId } = req.query;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!skillId) {
			throw new AppError('Power skill ID is required', 400);
		}

		const skill = await powerSkillRepository.findOne(skillId as string);
		if (!skill) {
			throw new AppError('Power skill not found', 404);
		}
		if (skill.isDeleted) {
			throw new AppError('Power skill is deleted', 404);
		}

		return AppResponse(res, 200, toJSON([skill]), 'Power skill retrieved successfully');
	});

	getAllPowerSkills = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const skills = await powerSkillRepository.findAll();
		if (!skills) {
			throw new AppError('No power skills found', 404);
		}

		return AppResponse(res, 200, toJSON(skills), 'Power skills retrieved successfully');
	});

	updatePowerSkill = catchAsync(async (req: Request, res: Response) => {
		const { skill, skillId, category } = req.body;
		const { user, file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a power skill', 403);
		}
		if (!skillId) {
			throw new AppError('Power skill ID is required', 400);
		}
		if (!skill) {
			throw new AppError('Skill is required', 400);
		}

		const existingSkill = await powerSkillRepository.findById(skillId);
		if (!existingSkill) {
			throw new AppError('Power skill not found', 404);
		}
		if (existingSkill.isDeleted) {
			throw new AppError('Power skill has already been deleted', 400);
		}

		let updatedSkill: IPowerSkill[] | null;
		if (file) {
			const { secureUrl: skillImage } = await uploadVideoFile({
				fileName: `skill-video/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});

			updatedSkill = await powerSkillRepository.update(skillId, {
				skillImage,
				powerskill: skill,
				...(category && category.trim() ? { category } : null),
			});
		} else {
			updatedSkill = await powerSkillRepository.update(skillId, {
				powerskill: skill,
				...(category && category.trim() ? { category } : null),
			});
		}
		if (!updatedSkill) {
			throw new AppError('Failed to update power skill', 500);
		}

		return AppResponse(res, 200, toJSON(updatedSkill), 'Power skill updated successfully');
	});

	deletePowerSkill = catchAsync(async (req: Request, res: Response) => {
		const { skillId } = req.body;
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a power skill', 403);
		}
		if (!skillId) {
			throw new AppError('Power skill ID is required', 400);
		}

		const existingSkill = await powerSkillRepository.findById(skillId);
		if (!existingSkill) {
			throw new AppError('Power skill not found', 404);
		}
		if (existingSkill.isDeleted) {
			throw new AppError('Power skill has already been deleted', 400);
		}

		const deletedSkill = await powerSkillRepository.update(skillId, {
			isDeleted: true,
		});
		if (!deletedSkill) {
			throw new AppError('Failed to delete power skill', 500);
		}

		return AppResponse(res, 200, null, 'Power skill deleted successfully');
	});
}

export const powerSkillController = new PowerSkillController();
