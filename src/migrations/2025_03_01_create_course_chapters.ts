import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('course_chapters', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.integer('chapterNumber').notNullable().defaultTo(1);
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.boolean('isDeleted').defaultTo(false);
        table.uuid('courseId').references('id').inTable('course').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('course_chapters');
}