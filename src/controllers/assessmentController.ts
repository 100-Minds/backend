import { Request, Response } from 'express';
import { AppResponse, AppError, toJSON } from '@/common/utils';
import { courseRepository, assessmentRepository } from '@/repository';
import { catchAsync } from '@/middlewares';
import { IAssessment } from '@/common/interfaces';

class AssessmentController {
	createAssessment = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { question, courseId, optionA, optionB, optionC, optionD, optionE, isCorrect } = req.body;

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
			optionE,
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
		if (!isCorrect || !Array.isArray(isCorrect) || isCorrect.length === 0) {
			throw new AppError('At least one correct answer is required', 400);
		}

		const providedOptions = Object.entries(validOptions)
			.filter(([, value]) => typeof value === 'string' && value.trim() !== '')
			.map(([key]) => key);

		// Validate that all correct answers are among the provided options
		const invalidAnswers = isCorrect.filter((answer) => !providedOptions.includes(answer));
		if (invalidAnswers.length > 0) {
			throw new AppError(
				`Correct answers must match the provided options. Invalid options: ${invalidAnswers.join(', ')}`,
				400
			);
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
			...(validOptions.optionE && { optionE: validOptions.optionE }),
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
	});

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
		const { assessmentId, courseId, question, optionA, optionB, optionC, optionD, optionE, isCorrect } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update an assessment', 403);
		}
		if (!assessmentId) {
			throw new AppError('Assessment ID is required', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const assessment = await assessmentRepository.findById(assessmentId);
		if (!assessment) {
			throw new AppError('Assessment not found', 404);
		}

		const questionExist = await assessmentRepository.findAssessmentByQuestionAndCourseId(question, courseId);
		if (questionExist) {
			throw new AppError('Question already exists', 400);
		}

		const updatedOptions = {
			optionA: optionA ?? assessment.optionA,
			optionB: optionB ?? assessment.optionB,
			optionC: optionC ?? assessment.optionC ?? null,
			optionD: optionD ?? assessment.optionD ?? null,
			optionE: optionE ?? assessment.optionE ?? null,
		};

		const availableOptions = ['optionA', 'optionB'];
		if (updatedOptions.optionC) availableOptions.push('optionC');
		if (updatedOptions.optionD) availableOptions.push('optionD');
		if (updatedOptions.optionE) availableOptions.push('optionE');

		let correctAnswers = isCorrect;
		if (correctAnswers) {
			if (!Array.isArray(correctAnswers)) {
				correctAnswers = [correctAnswers];
			}

			const invalidAnswers: string[] = correctAnswers.filter((answer: string) => !availableOptions.includes(answer));
			if (invalidAnswers.length > 0) {
				throw new AppError(
					`Correct answers must be from the provided options. Invalid options: ${invalidAnswers.join(', ')}. Available options: ${availableOptions.join(', ')}`,
					400
				);
			}
		} else {
			correctAnswers = assessment.isCorrect;
		}

		const updatedAssessmentData: IAssessment = {
			...(question && { question }),
			optionA: updatedOptions.optionA,
			optionB: updatedOptions.optionB,
			optionC: updatedOptions.optionC,
			optionD: updatedOptions.optionD,
			optionE: updatedOptions.optionE,
			isCorrect: correctAnswers,
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
