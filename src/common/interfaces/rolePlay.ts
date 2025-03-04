export interface IRolePlay {
	id: string;
	userId: string;
	timeSpent: string;
	scenarioId: string;
	courseId: string;
	isDone: boolean;
    isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
