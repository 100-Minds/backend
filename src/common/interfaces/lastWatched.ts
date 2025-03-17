export interface ILastWatched {
	id: string;
	userId: string;
	courseId: string;
	videoId: string;
	duration: string;
	lastWatchedAt: Date;
	created_at?: Date;
	updated_at?: Date;
}
