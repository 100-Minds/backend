import knex, { Knex } from 'knex';
import { ENVIRONMENT } from './environment';

const knexConfig: Knex.Config = {
	client: 'pg',
	connection: {
		host: ENVIRONMENT.DB.HOST,
		user: ENVIRONMENT.DB.USER,
		password: ENVIRONMENT.DB.PASSWORD,
		database: ENVIRONMENT.DB.DATABASE,
		port: ENVIRONMENT.DB.PORT ? parseInt(ENVIRONMENT.DB.PORT, 10) : 5432,
		//ssl: ENVIRONMENT.DB.SSL ? { rejectUnauthorized: false } : false,
	},
	pool: { min: 2, max: 10, propagateCreateError: false },
	migrations: {
		tableName: 'knex_migrations',
		directory: './src/migrations', 
	},
	acquireConnectionTimeout: 3000,
};

export const knexDb = knex(knexConfig);

const DB_NAME = ENVIRONMENT.DB.DATABASE;
export const connectDb = async (): Promise<void> => {
	try {
		await knexDb.raw('SELECT 1')
		console.log(`Database connected successfully to ${DB_NAME}`);
	} catch (error) {
		console.error('Error connecting to the database: ' + (error as Error).message);
		process.exit(1);
	}
};

export const disconnectDb = async (): Promise<void> => {
	try {
		await knexDb.destroy();
		console.log('Database connection closed');
	} catch (error) {
		console.error('Error closing the database: ' + (error as Error).message);
		process.exit(1);
	}
};
