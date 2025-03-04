import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('role_play', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').notNullable(); 
		table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').nullable();
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('SET NULL').notNullable();
		table.string('timeSpent').notNullable(); //accumulated time spent on the scenario
		table.boolean('isDone').defaultTo(false);
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('role_play');
}
