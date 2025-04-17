import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('user_learning_journey', (table) => {
		table.string('courseImage').defaultTo('');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('user_learning_journey', (table) => {
		table.dropColumn('courseImage');
	});
}
