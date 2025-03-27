import { VideoUploadStatus } from '../constants';

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
	userId: string;
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

export interface ILesson {
	course: ICourse;
	chapters: {
		id: string;
		title: string;
		chapterNumber: number;
		videos: ICourseVideo[];
		created_at?: Date;
		updated_at?: Date;
	}[];
}

export interface IChapterLesson {
	course: Pick<ICourse, 'id' | 'name'>;
	chapter: ICourseChapter;
	video: ICourseVideo[];
}
