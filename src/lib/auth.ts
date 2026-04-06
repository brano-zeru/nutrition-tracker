import { jwtVerify, SignJWT } from 'jose';
import { AuthPayload } from '@/types';
import { config } from 'dotenv';
import { appConfig } from '@/config';

const SECRET = new TextEncoder().encode(appConfig.jwtAuthSecret);

export async function signToken(payload: AuthPayload) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET);
}
