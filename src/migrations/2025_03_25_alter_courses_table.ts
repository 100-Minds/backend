import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('course', (table) => {
        table.string('courseImage').notNullable().defaultTo('');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('course', (table) => {
        table.string('courseImage').notNullable();
    });
}
