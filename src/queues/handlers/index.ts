import {
	EmailJobData,
	LoginEmailData,
} from '@/common/interfaces';
import { logger } from '@/common/utils';
import nodemailer from 'nodemailer';
import { ENVIRONMENT } from 'src/common/config';
import { loginEmail } from '../templates';

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
		case 'loginEmail':
			htmlContent = loginEmail(data as LoginEmailData);
			subject = 'Login Alert';
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
