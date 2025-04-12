import { CourseStatus } from '../common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('course', (table) => {
		table.enum('status', Object.values(CourseStatus)).defaultTo(CourseStatus.DRAFT);
		table.dropColumn('scenarioName');
		table.dropColumn('scenarioId');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('course', (table) => {
		table.string('scenarioName').nullable();
		table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('SET NULL').nullable();
	});
}
