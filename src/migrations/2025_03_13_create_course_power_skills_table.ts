import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_power_skills', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').notNullable();
		table.uuid('powerSkillId').references('id').inTable('sys_powerskill').onDelete('CASCADE').notNullable();
		table.unique(['courseId', 'powerSkillId']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_power_skills');
}
