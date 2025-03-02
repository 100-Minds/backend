import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('role_play', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('user').references('id').inTable('users').onDelete('CASCADE').notNullable(); // 1:1 with users.id
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('SET NULL').notNullable(); // 1:1 with sys_scenario.id
		table.string('timeSpent').notNullable();
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('role_play');
}
