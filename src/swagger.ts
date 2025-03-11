import swaggerJsdoc from 'swagger-jsdoc';
import { ENVIRONMENT } from './common/config';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Your API Documentation',
			version: '1.0.0',
			description: 'API documentation for your TypeScript Node.js application',
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === 'production'
						? 'https://backend-5781.onrender.com/api/v1'
						: `http://localhost:${ENVIRONMENT.APP.PORT || 3000}/api/v1`,
				description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
				anotherBearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
				cookieAuth: {
					type: 'apiKey',
					in: 'cookie',
					name: 'accessToken',
				},
			},
		},
	},
	apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
