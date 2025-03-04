import { ENVIRONMENT } from '../config';

/**
 * App wide constants go here
 *
 * e.g
 * export const APP_NAME = 'MyApp';
 */
export enum Role {
	SuperUser = 'superuser',
	User = 'user',
	Admin = 'admin',
}

export enum MemberType {
	Owner = 'owner',
	Regular = 'regular',
}

export enum StatusRequest {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
}

export enum QuizDifficulty {
	Beginner = 'beginner',
	Intermediate = 'intermediate',
	Expert = 'expert',
}

export const TOTPBaseConfig = {
	issuer: `${ENVIRONMENT.APP.NAME}`,
	label: `${ENVIRONMENT.APP.NAME}`,
	algorithm: 'SHA1',
	digits: 6,
};
