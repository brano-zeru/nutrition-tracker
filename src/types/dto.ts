import {
    User as PrismaUser,
    Profile as PrismaProfile,
    FoodLog as PrismaFoodLog,
} from '@prisma/client';

export type UserDTO = Pick<PrismaUser, 'id' | 'email' | 'role' | 'fullName'>;
export type FoodEntryDTO = Pick<
    PrismaFoodLog,
    'name' | 'calories' | 'protein' | 'notes'
>;

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
