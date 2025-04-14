export interface IScenario {
	id: string;
	scenario: string;
	scenarioImage: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICourseScenario {
	id: string;
	scenarioName: string;
	scenarioId: string;
	courseId: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}
