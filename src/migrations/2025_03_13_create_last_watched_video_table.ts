import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('last_watched', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('userId').references('id').inTable('users').onDelete('CASCADE').notNullable();
		table.uuid('moduleId').references('id').inTable('course_module').onDelete('CASCADE').notNullable();
		table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').notNullable();
		table.integer('chapterNumber').notNullable();
		table.uuid('chapterId').references('id').inTable('course_chapters').onDelete('CASCADE').notNullable();
		table.uuid('videoId').references('id').inTable('course_videos').onDelete('CASCADE').notNullable();
		table.string('duration').notNullable();
		table.boolean('isChapterCompleted').defaultTo(false);
		table.timestamp('lastWatchedAt').defaultTo(knex.fn.now());
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('last_watched');
}
