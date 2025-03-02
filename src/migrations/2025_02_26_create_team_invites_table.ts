import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('team_invites', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
		table.uuid('teamId').references('id').inTable('teams').onDelete('CASCADE');
		table.uuid('inviterId').references('id').inTable('users').onDelete('CASCADE');
		table.string('inviteLink').notNullable().unique(); // Unique invite link code
		table.timestamp('inviteLinkExpires');
		table.boolean('linkIsUsed').defaultTo(false);
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('team_invites');
}
