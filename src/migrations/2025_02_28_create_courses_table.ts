import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('name').notNullable();
		table.string('courseImage').notNullable();
		table.string('courseResources').nullable();
		table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').notNullable();
		table.string('scenarioName').nullable();
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('SET NULL').nullable();
		table.uuid('moduleId').references('id').inTable('course_module').onDelete('SET NULL').notNullable();
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course');
}
