export interface ILastWatched {
	id: string;
	userId: string;
	moduleId: string;
	courseId: string;
	chapterId: string;
	videoId: string;
	duration: string;
	lastWatchedAt: Date;
	created_at?: Date;
	updated_at?: Date;
}
