import { SignJWT, jwtVerify } from 'jose';
import { AuthPayload } from '@/types';
import { appConfig } from '@/config';

const SECRET = new TextEncoder().encode(appConfig.jwtAuthSecret);

export async function signToken(payload: AuthPayload) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as AuthPayload;
    } catch (error: unknown) {
        console.error('error: ', JSON.stringify((error as Error).message));
        return null;
    }
}
