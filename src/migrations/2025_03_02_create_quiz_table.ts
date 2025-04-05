import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('quiz', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('question').notNullable();
		table.string('optionA').notNullable();
		table.string('optionB').notNullable();
		table.string('optionC').nullable();
		table.string('optionD').nullable();
		table.string('isCorrect').notNullable();
		table.uuid('chapterId').notNullable().references('id').inTable('course_chapters').onDelete('SET NULL');
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('quiz');
}
