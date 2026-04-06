import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { RegisterUserDTO, UserDetails } from '@/types';

export class AuthService {
    static async register(data: RegisterUserDTO) {
        const {
            user: { email, password, fullName },
            profile: { age, height, weight, targetWeight },
        } = data;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const result = await prisma.user.create({
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
            include: {
                profile: true,
            },
        });

        if (!result) return null;

        return {
            user: {
                id: result.id,
                email: result.email,
                role: result.role,
                fullName: result.fullName,
            },
            profile: {
                age: result.profile?.age,
                height: result.profile?.height,
                weight: result.profile?.weight,
                targetWeight: result.profile?.targetWeight,
                calorieGoal: result.profile?.calorieGoal,
                proteinGoal: result.profile?.proteinGoal,
            },
        } as UserDetails;
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
