import { VideoUploadStatus } from '../../src/common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('course_videos', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.string('videoURL').notNullable();
		table.boolean('isDeleted').defaultTo(false);
		table.string('duration').notNullable();
		table.uuid('chapterId').references('id').inTable('course_chapters').onDelete('CASCADE').notNullable();
		table.enum('uploadStatus', Object.values(VideoUploadStatus)).defaultTo(VideoUploadStatus.PROCESSING);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('course_videos');
}
