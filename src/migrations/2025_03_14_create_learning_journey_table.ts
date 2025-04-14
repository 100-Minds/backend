import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('learning_journey', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('moduleId').references('id').inTable('course_module').onDelete('CASCADE').notNullable();
		table.string('moduleName').notNullable();
		table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').notNullable();
		table.string('courseName').notNullable();
		// table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('CASCADE').notNullable();
		// table.string('scenarioName').notNullable();
		table.boolean('isRequired').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('learning_journey');
}
