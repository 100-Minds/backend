import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sys_powerskill', (table) => {
		table.string('category').notNullable().defaultTo('');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sys_powerskill', (table) => {
		table.dropColumn('category');
	});
}
