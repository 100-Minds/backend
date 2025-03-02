export interface IRolePlay {
	id: string;
	userId: string;
	timeSpent: Date;
	scenarioId: string;
	rolePlayImage: string;
    isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
