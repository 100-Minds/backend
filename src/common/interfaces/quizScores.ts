export interface IQuizScores {
	id: string;
	userId: string;
	chapterId: string;
	courseId: string
	quizId: string | null;
	score: number;
	created_at?: Date;
	updated_at?: Date;
}
