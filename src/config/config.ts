import { config } from 'dotenv';

config();

export const appConfig = {
    jwtAuthSecret: process.env.JWT_AUTH_SECRET || '',
    dataBaseUrl: process.env.DATABASE_URL || '',
};
