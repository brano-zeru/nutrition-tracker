import { prisma } from '@/lib/prisma';
import { ProfileDTO } from '@/types/dto';

export class UserService {
    static async getUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        return user;
    }

    static async getProfile(userId: string): Promise<ProfileDTO | null> {
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) return null;

        return {
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            targetWeight: profile.targetWeight,
            calorieGoal: profile.calorieGoal,
            proteinGoal: profile.proteinGoal,
            activityLevel: profile.activityLevel,
        };
    }

    static async updateProfile(
        userId: string,
        profile: Partial<ProfileDTO>,
    ): Promise<ProfileDTO> {
        const profileResult = await prisma.profile.update({
            where: { userId },
            data: { ...profile },
        });

        return {
            age: profileResult.age,
            height: profileResult.height,
            weight: profileResult.weight,
            targetWeight: profileResult.targetWeight,
            calorieGoal: profileResult.calorieGoal,
            proteinGoal: profileResult.proteinGoal,
            activityLevel: profileResult.activityLevel,
        };
    }

    static async isEmailUsed(email: string) {
        const emailResults = await prisma.user.findUnique({
            where: { email },
        });

        return !!emailResults;
    }
}
