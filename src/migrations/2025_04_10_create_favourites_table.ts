import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_favourites', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').notNullable().references('id').inTable('users').onDelete('SET NULL');
		table.uuid('courseId').notNullable().references('id').inTable('course').onDelete('SET NULL');
		table.uuid('chapterId').notNullable().references('id').inTable('course_chapters').onDelete('SET NULL');
		table.string('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_favourites');
}
