import {
	EmailJobData,
	LoginEmailData,
	ResetPasswordData,
	ForgotPasswordData,
	TeamInvitationData,
	TeamInvitationSuccessData,
	RemoveTeamMemberData,
	VideoUploadSuccessData,
	VideoUploadFailedData,
	WelcomeEmailData,
} from '@/common/interfaces';
import { logger } from '@/common/utils';
import nodemailer from 'nodemailer';
import { ENVIRONMENT } from 'src/common/config';
import {
	forgotPasswordEmail,
	loginEmail,
	removeTeamMemberEmail,
	resetPasswordEmail,
	teamInviteEmail,
	teamInviteSuccessEmail,
	videoUploadFailedEmail,
	videoUploadSuccessEmail,
	welcomeEmail,
} from '../templates';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: ENVIRONMENT.EMAIL.GMAIL_USER,
		pass: ENVIRONMENT.EMAIL.GMAIL_PASSWORD,
	},
});

export const sendEmail = async (job: EmailJobData) => {
	const { data, type } = job as EmailJobData;

	let htmlContent: string;
	let subject: string;

	switch (type) {
		case 'welcomeEmail':
			htmlContent = welcomeEmail(data as WelcomeEmailData);
			subject = 'Welcome to 100 Minds';
			break;
		case 'loginEmail':
			htmlContent = loginEmail(data as LoginEmailData);
			subject = 'Login Alert';
			break;
		case 'forgotPassword':
			htmlContent = forgotPasswordEmail(data as ForgotPasswordData);
			subject = 'Forgot Password';
			break;
		case 'resetPassword':
			htmlContent = resetPasswordEmail(data as ResetPasswordData);
			subject = 'Reset Password';
			break;
		case 'teamInvitation':
			htmlContent = teamInviteEmail(data as TeamInvitationData);
			subject = 'Team Invitation';
			break;
		case 'teamInvitationSuccess':
			htmlContent = teamInviteSuccessEmail(data as TeamInvitationSuccessData);
			subject = 'Team Invitation Success';
			break;
		case 'removeTeamMember':
			htmlContent = removeTeamMemberEmail(data as RemoveTeamMemberData);
			subject = 'Team Eviction';
			break;
		case 'videoUploadSuccess':
			htmlContent = videoUploadSuccessEmail(data as VideoUploadSuccessData);
			subject = 'Video Upload Success';
			break;
		case 'videoUploadFailed':
			htmlContent = videoUploadFailedEmail(data as VideoUploadFailedData);
			subject = 'Video Upload Failed';
			break;
		// Handle other email types...
		default:
			throw new Error(`No template found for email type: ${type}`);
	}

	const mailOptions = {
		from: `"100MINDS" <${ENVIRONMENT.EMAIL.GMAIL_USER}>`,
		to: data.to,
		subject: subject,
		html: htmlContent,
	};

	try {
		const dispatch = await transporter.sendMail(mailOptions);
		console.log(dispatch);
		logger.info(`Email successfully sent to ${data.to}`);
	} catch (error) {
		console.error(error);
		logger.error(`Failed to send email to ${data.to}: ${error}`);
	}
};
