import { config } from 'dotenv';
import z from 'zod';

config();

export const appConfigSchema = z.object({
    jwtAuthSecret: z.string(),
    dataBaseUrl: z.string(),
});

const appConfig = {
    jwtAuthSecret: process.env.JWT_AUTH_SECRET,
    dataBaseUrl: process.env.DATABASE_URL,
};

const appConfigData = appConfigSchema.parse(appConfig);

export { appConfigData as appConfig };
