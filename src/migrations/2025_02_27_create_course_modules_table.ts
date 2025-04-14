import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_module', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('name').notNullable();
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_module');
}
