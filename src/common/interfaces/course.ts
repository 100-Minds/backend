export interface ICourse {
	id: string;
	name: string;
	userId: string;
	scenarioId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseChapter {
	id: string;
	title: string;
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
	blurHash: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
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
