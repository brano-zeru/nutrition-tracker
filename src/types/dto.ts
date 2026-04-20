import {
    User as PrismaUser,
    Profile as PrismaProfile,
    FoodLog as PrismaFoodLog,
} from '@prisma/client';

export type UserDTO = Pick<PrismaUser, 'id' | 'email' | 'role' | 'fullName'>;

export type FoodEntry = Omit<
    Pick<
        PrismaFoodLog,
        'id' | 'foodName' | 'calories' | 'protein' | 'notes' | 'createdAt'
    >,
    'createdAt' | 'foodName'
> & {
    timestamp: PrismaFoodLog['createdAt'];
    name: PrismaFoodLog['foodName'];
};
export type FoodEntryDTO = Omit<FoodEntry, 'id' | 'timestamp'>;

export type ProfileDTO = Pick<
    PrismaProfile,
    | 'age'
    | 'height'
    | 'weight'
    | 'targetWeight'
    | 'calorieGoal'
    | 'proteinGoal'
    | 'activityLevel'
>;

export interface UserDetails {
    user: UserDTO;
    profile: ProfileDTO;
}

export interface RegisterUserDTO extends Omit<UserDetails, 'user'> {
    user: Omit<UserDTO, 'id'> & {
        password: string;
    };
}

export type UserGoals = Pick<
    ProfileDTO,
    'targetWeight' | 'calorieGoal' | 'proteinGoal'
>;
