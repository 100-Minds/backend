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

export enum VideoUploadStatus {
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

export enum LearningStatus {
	IN_PROGRESS = 'in-progress',
	COMPLETED = 'completed',
}

export enum AccountType {
	PERSONAL = 'personal',
	ORGANIZATION = 'organization',
}

export enum CourseStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
}
