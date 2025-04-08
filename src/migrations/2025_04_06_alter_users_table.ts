import { AccountType } from '../common/constants';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.enum('accountType', Object.values(AccountType)).defaultTo(AccountType.PERSONAL);
		table.string('organizationLogo');
		table.string('organizationName');
		table.string('organizationWebsite');
		table.string('organizationDescription');
		table.string('bio');
		table.string('careerGoals');
		table.string('opportunities');
		table.string('strengths');
		table.string('assessment');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table) => {
		table.enum('accountType', Object.values(AccountType)).defaultTo(AccountType.PERSONAL);
		table.string('organizationLogo');
		table.string('organizationName');
		table.string('organizationWebsite');
		table.string('organizationDescription');
		table.string('bio');
		table.string('careerGoals');
		table.string('opportunities');
		table.string('strengths');
		table.string('assessment');
	});
}
