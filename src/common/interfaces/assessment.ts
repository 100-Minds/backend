export interface IAssessment {
	id: string;
	question: string;
	optionA: string;
	optionB: string;
	optionC: string;
	optionD: string;
	optionE: string;
	isCorrect: string[];
	courseId: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface IAssessmentScores {
	id: string;
	userId: string;
	courseId: string
	assessmentId: string | null;
	score: number;
	created_at?: Date;
	updated_at?: Date;
}
