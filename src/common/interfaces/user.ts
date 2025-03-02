import { Role } from '../constants';

export interface IUser {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	ipAddress: string;
	otp: string;
	otpExpires: Date;
	photo: string;
	role: Role;
	passwordResetRetries: number;
	passwordResetToken: string;
	passwordResetExpires: Date;
	passwordChangedAt: Date;
	loginRetries: number;
	lastLogin: Date;
	isSuspended: boolean;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
