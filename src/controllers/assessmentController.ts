import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, assessmentRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { IAssessment } from '@/common/interfaces';

class AssessmentController {
	createAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { question, courseId, optionA, optionB, optionC, optionD, isCorrect } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create assessments', 403);
		}

		const validOptions = {
			optionA,
			optionB,
			optionC,
			optionD,
		};
		if (!question) {
			throw new AppError('Question is required', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}
		if (!validOptions.optionA) {
			throw new AppError('Option A is required', 400);
		}
		if (!validOptions.optionB) {
			throw new AppError('Option B is required', 400);
		}
		if (!isCorrect) {
			throw new AppError('Correct answer is required', 400);
		}
		const providedOptions = Object.entries(validOptions)
			.filter(([, value]) => typeof value === 'string' && value.trim() !== '')
			.map(([key]) => key);
		if (!providedOptions.includes(isCorrect)) {
			throw new AppError(`Correct answer must match one of the provided options: ${providedOptions.join(', ')}`, 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) throw new AppError('Course not found', 404);

		const questionExist = await assessmentRepository.findAssessmentByQuestionAndCourseId(question, courseId);
		if (questionExist) {
			throw new AppError('Question already exists', 400);
		}

		const [assessment] = await assessmentRepository.create({
			question,
			courseId,
			optionA,
			optionB,
			...(validOptions.optionC && validOptions.optionC ? { optionC: validOptions.optionC } : null),
			...(validOptions.optionA && validOptions.optionD ? { optionD: validOptions.optionD } : null),
			isCorrect,
		});
		if (!assessment) {
			throw new AppError('Failed to create assessment', 500);
		}

		return AppResponse(res, 201, toJSON([assessment]), 'Assessment created successfully');
	});

	findById = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { assessmentId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!assessmentId) {
			throw new AppError('Assessment ID is required', 400);
		}

		const assessment = await assessmentRepository.findById(assessmentId as string);
		if (!assessment) {
			throw new AppError('Assessment not found', 404);
		}

		return AppResponse(res, 200, toJSON([assessment]), 'Assessment retrieved successfully');
	})

	findAssessmentByCourseId = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const assessment = await assessmentRepository.findAssessmentByCourseId(courseId as string);
		if (!assessment) {
			throw new AppError('Assessment not found', 404);
		}

		return AppResponse(res, 200, toJSON(assessment), 'Course assessment retrieved successfully');
	});

	updateAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { assessmentId, question, optionA, optionB, optionC, optionD, isCorrect } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update an assessment', 403);
		}
		if (!assessmentId) {
			throw new AppError('Assessment ID is required', 400);
		}

		const assessment = await assessmentRepository.findById(assessmentId);
		if (!assessment) {
			throw new AppError('Assessment not found', 404);
		}

		const updatedOptions = {
			optionA: optionA ?? assessment.optionA,
			optionB: optionB ?? assessment.optionB,
			optionC: optionC ?? null,
			optionD: optionD ?? null,
		};

		const availableOptions = ['optionA', 'optionB'];
		if (updatedOptions.optionC) availableOptions.push('optionC');
		if (updatedOptions.optionD) availableOptions.push('optionD');
		if (!availableOptions.includes(isCorrect)) {
			throw new AppError(`Correct answer must be one of the provided options: ${availableOptions.join(', ')}`, 400);
		}

		const updatedAssessmentData: IAssessment = {
			...(question && { question }),
			optionA: updatedOptions.optionA,
			optionB: updatedOptions.optionB,
			optionC: updatedOptions.optionC,
			optionD: updatedOptions.optionD,
			isCorrect,
		};
		if (Object.keys(updatedAssessmentData).length === 0) {
			throw new AppError('No fields to update', 400);
		}

		const [updatedAssessment] = await assessmentRepository.update(assessmentId, updatedAssessmentData);
		if (!updatedAssessment) {
			throw new AppError('Failed to update assessment', 500);
		}

		return AppResponse(res, 200, toJSON([updatedAssessment]), 'Assessment updated successfully');
	});

	deleteAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { assessmentId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete an assessment', 403);
		}
		if (!assessmentId) {
			throw new AppError('Assessment ID is required', 400);
		}

		const assessment = await assessmentRepository.findById(assessmentId);
		if (!assessment) {
			throw new AppError('Assessment not found', 404);
		}

		const deletedAssessment = await assessmentRepository.delete(assessmentId);
		if (!deletedAssessment) {
			throw new AppError('Failed to delete assessment', 500);
		}

		return AppResponse(res, 200, null, 'Assessment deleted successfully');
	});
}

export const assessmentController = new AssessmentController();
