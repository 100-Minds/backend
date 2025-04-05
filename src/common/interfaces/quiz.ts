export interface IQuiz {
	id: string;
	question: string;
	optionA: string;
	optionB: string;
	optionC: string;
	optionD: string;
	isCorrect: string;
	chapterId: string;
	created_at?: Date;
	updated_at?: Date;
}
