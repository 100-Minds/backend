import { Knex } from 'knex';
import { MemberType, StatusRequest } from '../../src/common/constants';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('team_members', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('teamId').references('id').inTable('teams').onDelete('CASCADE'); 
		table.uuid('userId').references('id').inTable('users').onDelete('CASCADE');
		table.enum('memberType', Object.values(MemberType)).defaultTo(MemberType.Regular);
		table.enum('statusRequest', Object.values(StatusRequest)).notNullable().defaultTo(StatusRequest.PENDING);
		table.boolean('isDeleted').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('team_members');
}
