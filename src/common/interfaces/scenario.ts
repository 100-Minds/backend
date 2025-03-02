export interface IScenario {
	id: string;
	scenario: string;
	userId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
