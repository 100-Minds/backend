import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('assessment_scores', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
		table.uuid('courseId').notNullable().references('id').inTable('course').onDelete('SET NULL');
		table.uuid('assessmentId').nullable().references('id').inTable('assessment').onDelete('SET NULL');
		table.integer('score').notNullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('assessment_scores');
}
