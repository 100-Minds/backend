import { LearningStatus } from '../../src/common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('user_learning_journey', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').notNullable();
		table.uuid('moduleId').references('id').inTable('course_module').onDelete('CASCADE').notNullable();
		table.string('moduleName').notNullable();
		table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').notNullable();
		table.string('courseName').notNullable();
		table.uuid('chapterId').references('id').inTable('course_chapters').onDelete('CASCADE').nullable();
		// table.uuid('scenarioId').references('id').inTable('sys_scenario').onDelete('CASCADE').notNullable();
		// table.string('scenarioName').notNullable();
		table.enum('status', Object.values(LearningStatus)).defaultTo(LearningStatus.IN_PROGRESS);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('user_learning_journey');
}
