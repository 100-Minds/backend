export interface IFavourites {
	id: string;
    userId: string;
	courseId: string;
	chapterId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
