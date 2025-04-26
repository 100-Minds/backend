export interface IQuiz {
	id: string;
	question: string;
	optionA: string;
	optionB: string;
	optionC: string;
	optionD: string;
	optionE: string;
	isCorrect: string[];
	courseId: string;
	chapterId: string;
	created_at?: Date;
	updated_at?: Date;
}
