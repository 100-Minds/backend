import { VideoUploadStatus } from '../constants';
import { IQuiz } from './quiz';
import { IScenario } from './scenario';

export interface IModule {
	id: string;
	name: string;
	userId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourse {
	id: string;
	name: string;
	courseImage: string;
	courseResources: string | null;
	moduleId: string;
	scenarioName: string | null;
	scenarioId: string | null;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseChapter {
	id: string;
	title: string;
	description: string;
	courseId: string;
	chapterNumber: number;
	chapterResources: string | null;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseVideo {
	id: string;
	chapterId: string;
	videoURL: string;
	duration: string;
	uploadStatus: VideoUploadStatus;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseWithModuleName extends ICourse {
	moduleName: string | null;
}

export interface ICourseChapterWithVideoUrl extends ICourseChapter {
	videoUrl: string;
}

export interface ICourseWithSkillsAndScenario {
	course: ICourse;
	scenarios: {
		scenarioId: string;
		scenarioName: string;
	}[];
	skills: {
		powerSkillId: string;
		powerSkillName: string;
	}[];
}

export interface ILesson {
	course: ICourse;
	chapters: {
		id: string;
		title: string;
		chapterNumber: number;
		chapterResources: string;
		videos: ICourseVideo[];
		//quiz: IQuiz[];
		created_at?: Date;
		updated_at?: Date;
	}[];
}

export interface IChapterLesson {
	course: Pick<ICourse, 'id' | 'name' | 'courseResources'>;
	chapter: ICourseChapter;
	quiz: IQuiz[];
	rolePlay: IScenario;
	video: ICourseVideo;
}
