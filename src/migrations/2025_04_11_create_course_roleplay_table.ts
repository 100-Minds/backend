import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_roleplay', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('courseId').notNullable().references('id').inTable('course').onDelete('SET NULL');
		table.string('scenarioName').notNullable();
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('SET NULL').notNullable();
		table.string('isDeleted').defaultTo(false);
        table.unique(['courseId', 'scenarioId']);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_roleplay');
}
