export interface ILastWatched {
	id: string;
	userId: string;
	moduleId: string;
	courseId: string;
	chapterNumber: number;
	chapterId: string;
	videoId: string;
	duration: string;
	lastWatchedAt: Date;
	isChapterCompleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
