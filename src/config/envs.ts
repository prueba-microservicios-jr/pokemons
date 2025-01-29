import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
	PORT: number;
	DATABASE_URL: string;
}

const envsSchema = joi
	.object({
		PORT: joi.number().required(),
		DATABASE_URL: joi.string().required(),
	})
	.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const envs: Envs = value;

export const evns = {
	port: envs.PORT,
	databaseurl: envs.DATABASE_URL,
};
