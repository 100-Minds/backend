import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('assessment', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('question').notNullable();
		table.string('optionA').notNullable();
		table.string('optionB').notNullable();
		table.string('optionC').nullable();
		table.string('optionD').nullable();
		table.string('isCorrect').notNullable();
		table.uuid('courseId').notNullable().references('id').inTable('course').onDelete('SET NULL');
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('assessment');
}
