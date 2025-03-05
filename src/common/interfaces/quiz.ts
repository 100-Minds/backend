import { QuizDifficulty } from '../constants';

export interface IQuiz {
	id: string;
	userId: string;
	courseId: string;
	score: number;
	difficulty: QuizDifficulty;
	created_at?: Date;
	updated_at?: Date;
}
