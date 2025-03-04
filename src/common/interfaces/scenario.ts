export interface IScenario {
	id: string;
	scenario: string;
	userId: string;
	scenarioImage: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
