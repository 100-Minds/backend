import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('learning_journey', (table) => {
		table.dropColumn('scenarioName');
        table.dropColumn('scenarioId');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('learning_journey', (table) => {
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('CASCADE').notNullable();
		table.string('scenarioName').notNullable();
	});
}
