import { LearningStatus } from '../constants';

export interface StructuredCourse {
	courseId: string;
	courseName: string;
	courseImage: string;
	chapters: { chapterId: string; chapterTitle: string }[];
}

export interface StructuredModule {
	moduleId: string;
	moduleName: string;
	isRequired: boolean;
	courses: Record<string, StructuredCourse>;
}

export interface StructuredJourney {
	moduleId: string;
	moduleName: string;
	courses: Record<
		string,
		{
			courseId: string;
			courseName: string;
			courseImage: string;
			status: string;
			chapters: { chapterId: string; status: string; chapterNumber: number }[];
		}
	>;
}

export interface ILearningJourney {
	id: string;
	moduleId: string;
	moduleName: string;
	courseId: string;
	courseName: string;
	courseImage: string;
	chapterId: string;
	created_at: Date;
	updated_at: Date;
}

export interface IUserLearningJourney {
	id: string;
	userId: string;
	moduleId: string;
	moduleName: string;
	courseId: string;
	courseName: string;
	courseImage: string;
	chapterId: string;
	status: LearningStatus;
	created_at?: Date;
	updated_at?: Date;
}
