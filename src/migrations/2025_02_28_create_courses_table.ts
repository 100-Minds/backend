import { Knex } from 'knex';
import { CourseStatus } from '../common/constants';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('name').notNullable();
		table.string('courseImage').notNullable();
		table.string('courseResources').nullable();
		table.enum('status', Object.values(CourseStatus)).defaultTo(CourseStatus.DRAFT);
		table.uuid('moduleId').references('id').inTable('course_module').onDelete('SET NULL').notNullable();
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course');
}
