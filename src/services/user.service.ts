import { prisma } from '@/lib/prisma';
import {
    persistedUserSchema,
    userProfileSchema,
} from '@/lib/validations/schemas';
import { ProfileDTO, UserDTO } from '@/types/dto';

export class UserService {
    static async getUser(userId: string): Promise<UserDTO | null> {
        const userResult = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userResult) return null;

        return persistedUserSchema.parse(userResult);
    }

    static async getProfile(userId: string): Promise<ProfileDTO | null> {
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) return null;

        return userProfileSchema.parse(profile) as ProfileDTO;
    }

    static async updateProfile(
        userId: string,
        profile: Partial<ProfileDTO>,
    ): Promise<ProfileDTO | null> {
        const profileResult = await prisma.profile.update({
            where: { userId },
            data: { ...profile },
        });

        if (!profileResult) return null;

        return userProfileSchema.parse(profileResult);
    }

    static async isEmailUsed(email: string) {
        const emailResults = await prisma.user.findUnique({
            where: { email },
        });

        return !!emailResults;
    }
}
