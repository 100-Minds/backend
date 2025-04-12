import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('course_power_skills', (table) => {
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('course_power_skills', (table) => {
		table.timestamps(true, true);
	});
}
