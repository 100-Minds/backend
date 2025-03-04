import { Knex } from 'knex';
import { QuizDifficulty } from '@/common/constants';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('quiz_scores', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
		table.uuid('courseId').nullable().references('id').inTable('course').onDelete('SET NULL');
		table.integer('score').notNullable();
		table.enu('difficulty', Object.values(QuizDifficulty)).nullable();
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('quiz_scores');
}
