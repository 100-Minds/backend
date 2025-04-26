import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	// Add optionE column
	await knex.schema.alterTable('quiz', (table) => {
		table.string('optionE').nullable();
	});

	// Rename the old isCorrect column
	await knex.schema.raw(`ALTER TABLE quiz RENAME COLUMN "isCorrect" TO "isCorrect_old"`);

	// Add the new isCorrect column as array type
	await knex.schema.raw(`ALTER TABLE quiz ADD COLUMN "isCorrect" TEXT[]`);

	// Convert existing data
	await knex.raw(`UPDATE quiz SET "isCorrect" = ARRAY["isCorrect_old"]`);

	// Make the new column not nullable
	await knex.schema.raw(`ALTER TABLE quiz ALTER COLUMN "isCorrect" SET NOT NULL`);

	// Drop the old column
	await knex.schema.raw(`ALTER TABLE quiz DROP COLUMN "isCorrect_old"`);
}

export async function down(knex: Knex): Promise<void> {
	// Add a temporary string column
	await knex.schema.raw(`ALTER TABLE quiz ADD COLUMN "isCorrect_old" TEXT`);

	// Convert array data back to string (taking first element)
	await knex.raw(`UPDATE quiz SET "isCorrect_old" = "isCorrect"[1]`);

	// Make the temporary column not nullable
	await knex.schema.raw(`ALTER TABLE quiz ALTER COLUMN "isCorrect_old" SET NOT NULL`);

	// Drop the array column
	await knex.schema.raw(`ALTER TABLE quiz DROP COLUMN "isCorrect"`);

	// Rename the temporary column back to the original name
	await knex.schema.raw(`ALTER TABLE quiz RENAME COLUMN "isCorrect_old" TO "isCorrect"`);

	// Remove optionE column
	await knex.schema.alterTable('quiz', (table) => {
		table.dropColumn('optionE');
	});
}
