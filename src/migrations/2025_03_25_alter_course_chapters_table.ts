import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('course_chapters', (table) => {
        table.string('description').notNullable().defaultTo('');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('course_chapters', (table) => {
        table.dropColumn('description');
    });
}
