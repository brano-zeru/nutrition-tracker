import { prisma } from '@/lib/prisma';

export class UserService {
    static async getUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        return user;
    }

    // static async getUserDetails(userId: string): Promise<UserDetails | null> {
    //     const data = await prisma.user.findUnique({
    //         where: { id: userId },
    //         select: {
    //             id: true,
    //             email: true,
    //             fullName: true,
    //             role: true,
    //             profile: {
    //                 select: {
    //                     age: true,
    //                     height: true,
    //                     weight: true,
    //                     targetWeight: true,
    //                     calorieGoal: true,
    //                     proteinGoal: true,
    //                 },
    //             },
    //         },
    //     });

    //     if (!data) return null;

    //     return {
    //         user: {
    //             id: data.id,
    //             email: data.email,
    //             fullName: data.fullName,
    //             role: data.role,
    //         },
    //         profile: data.profile,
    //     };
    // }

    // static async upsertProfile(
    //     userId: string,
    //     data: Partial<ProfileDTO>,
    // ): Promise<ProfileDTO | null> {
    //     return await prisma.profile.upsert({
    //         where: { userId },
    //         update: data,
    //         create: {
    //             ...data,
    //             userId: userId,
    //         },
    //     });
    // }

    // static async getUserGoals(userId: string): Promise<UserGoals | null> {
    //     const goals = await prisma.profile.findUnique({
    //         where: { userId },
    //         select: {
    //             targetWeight: true,
    //             calorieGoal: true,
    //             proteinGoal: true,
    //         },
    //     });

    //     if (!goals) return null;

    //     return {
    //         targetWeight: goals.targetWeight,
    //         calorieGoal: goals.calorieGoal,
    //         proteinGoal: goals.proteinGoal,
    //     };
    // }

    // static async setUserProfile(
    //     userId: string,
    //     goals: ProfileDTO,
    // ): Promise<ProfileDTO | null> {
    //     const profileResults = await prisma.profile.create({
    //         data: {
    //             userId,
    //             targetWeight: goals.targetWeight,
    //             calorieGoal: goals.calorieGoal,
    //             proteinGoal: goals.proteinGoal,
    //         },
    //         select: {
    //             age: true,
    //             height: true,
    //             weight: true,
    //             targetWeight: true,
    //             calorieGoal: true,
    //             proteinGoal: true,
    //         },
    //     });

    //     return profileResults;
    // }
}
