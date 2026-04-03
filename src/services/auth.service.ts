import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export class AuthService {
    static async register(email: string, password: string, fullName: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            return null;
        }

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
