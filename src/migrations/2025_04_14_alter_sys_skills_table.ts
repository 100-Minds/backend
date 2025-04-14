import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sys_powerskill', (table) => {
		table.dropColumn('userId');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sys_powerskill', (table) => {
		table.uuid('userId').references('id').inTable('users').onDelete('SET NULL').nullable();
	});
}
