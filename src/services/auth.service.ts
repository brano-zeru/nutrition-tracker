import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { RegisterUserDTO, UserDTO } from '@/types';

export class AuthService {
    static async register(data: RegisterUserDTO): Promise<UserDTO | null> {
        const {
            user: { email, password, fullName },
            profile: { age, height, weight, targetWeight },
        } = data;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const userResults = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                profile: {
                    create: {
                        age,
                        height,
                        weight,
                        targetWeight: targetWeight || null,
                    },
                },
            },
        });

        if (!userResults) return null;

        return {
            id: userResults.id,
            email: userResults.email,
            role: userResults.role,
            fullName: userResults.fullName,
        };
    }

    static async login(
        email: string,
        password: string,
    ): Promise<UserDTO | null> {
        const userResults = await prisma.user.findUnique({
            where: { email },
        });

        if (!userResults) return null;

        const isPasswordValid = await bcrypt.compare(
            password,
            userResults.passwordHash,
        );

        if (!isPasswordValid) return null;

        return {
            id: userResults.id,
            email: userResults.email,
            fullName: userResults.fullName,
            role: userResults.role,
        };
    }
}
