import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('quiz_scores', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
		table.uuid('chapterId').notNullable().references('id').inTable('course_chapters').onDelete('SET NULL');
		table.uuid('courseId').notNullable().references('id').inTable('course').onDelete('SET NULL');
		table.uuid('quizId').nullable().references('id').inTable('quiz').onDelete('SET NULL');
		table.integer('score').notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('quiz_scores');
}
