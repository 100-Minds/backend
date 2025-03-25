import { QuizDifficulty } from '@/common/constants';
import { dateFromString } from '@/common/utils';
import { z } from 'zod';

const passwordRegexMessage =
	'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character or symbol';

export const mainSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters long')
		.max(50, 'First name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'First name must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters long')
		.max(50, 'Last name must not be 50 characters long')
		.refine((name) => /^(?!.*-[a-z])[A-Z][a-z'-]*(?:-[A-Z][a-z'-]*)*(?:'[A-Z][a-z'-]*)*$/g.test(name), {
			message:
				'Last name must be in sentence case, can include hyphen, and apostrophes (e.g., "Ali", "Ade-Bright" or "Smith\'s").',
		}),
	username: z.string().min(3).trim().toLowerCase(),
	email: z.string().email('Please enter a valid email address!').toLowerCase(),
	password: z
		.string()
		.min(8, 'Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	confirmPassword: z
		.string()
		.min(8, 'Confirm Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	otp: z.string().min(6, 'OTP must be at least 6 characters long'),
	otpExpires: z.string().transform(dateFromString),
	token: z.string(),
	receiveCodeViaEmail: z.boolean(),
	name: z.string().min(3).trim(),
	title: z.string().min(3).trim(),
	teamId: z.string().min(7),
	courseId: z.string().min(7),
	description: z.string().min(7),
	memberId: z.string().min(7),
	chapterId: z.string().min(7),
	videoId: z.string().min(7),
	inviteLink: z.string().min(7),
	inviteLinkExpires: z.string().transform(dateFromString),
	scenario: z.string().min(3).trim(),
	scenarioId: z.string().min(7),
	moduleId: z.string().min(7),
	isDone: z.boolean(),
	timeSpent: z.string().min(1),
	rolePlayId: z.string().min(7),
	score: z.number().positive(),
	quizId: z.string().min(7),
	difficulty: z.enum(Object.values(QuizDifficulty) as [string, ...string[]]),
	fileName: z.string(),
	fileType: z.string(),
	fileSize: z.number(),
	videoLength: z.string(),
	key: z.string(),
	skill: z.string(),
	skills: z.array(z.string()),
	skillId: z.string().min(7),
	videoUploadStatus: z.string(),
	amount: z.number().positive(),
	duration: z.string(),
	lastWatched: z.string(),
	suspend: z.boolean(),
	makeAdmin: z.boolean(),
	userId: z.string().min(7),
	// hideMyDetails: z.boolean().default(false),
	message: z.string().min(10),
	oldPassword: z.string().min(8),
	newPassword: z
		.string()
		.min(8, 'Password must have at least 8 characters!')
		.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/, {
			message: passwordRegexMessage,
		}),
	// redirectUrl: z.string().url(),
});

// Define the partial for partial validation
export const partialMainSchema = mainSchema.partial();
