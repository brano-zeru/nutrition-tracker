import { jwtVerify, SignJWT } from 'jose';
import { AuthPayload } from '@/types';
import { config } from 'dotenv';

config();

const SECRET = new TextEncoder().encode(process.env.JWT_AUTH_SECRET);

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
        const jwtPayload = payload as unknown as AuthPayload;

        if (!jwtPayload.sub || !jwtPayload.email) {
            return null;
        }

        return {
            sub: jwtPayload.sub,
            email: jwtPayload.email,
            fullName: jwtPayload.fullName,
            role: jwtPayload.role,
            iat: jwtPayload.iat,
            exp: jwtPayload.exp,
        };
    } catch (error) {
        return null;
    }
}
