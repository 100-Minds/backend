import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('learning_journey', (table) => {
		table.boolean('isRequired').defaultTo(false);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('learning_journey', (table) => {
		table.dropColumn('isRequired');
	});
}
