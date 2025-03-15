import { LearningStatus } from '../constants';

export interface StructuredCourse {
	courseId: string;
	courseName: string;
	scenarios: { scenarioId: string; scenarioName: string }[];
	chapters: { chapterId: string; chapterTitle: string }[];
}

export interface StructuredModule {
	moduleId: string;
	moduleName: string;
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
			scenarioId: string;
			scenarioName: string;
			status: string;
			chapters: { chapterId: string; status: string, chapterNumber: number }[];
		}
	>;
}

export interface StructuredUserCourseJourney {
	courseId: string;
	courseName: string;
	scenarios: { scenarioId: string; scenarioName: string }[];
	chapters: { chapterId: string; status: string }[];
	status: string;
}

export interface ILearningJourney {
	id: string;
	moduleId: string;
	moduleName: string;
	courseId: string;
	courseName: string;
	chapterId: string;
	scenarioId: string;
	scenarioName: string;
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
	chapterId: string;
	scenarioId: string;
	scenarioName: string;
	status: LearningStatus;
	created_at?: Date;
	updated_at?: Date;
}
