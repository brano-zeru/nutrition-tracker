import { User as PrismaUser, Profile as PrismaProfile } from '@prisma/client';

export interface FoodEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    notes: string;
    timestamp: Date;
}

export interface SavedFood {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
}

export interface DailyLog {
    date: string; // YYYY-MM-DD format
    entries: FoodEntry[];
    calorieGoal: number;
    proteinGoal: number;
}

export interface NutritionGoals {
    calorieGoal: number;
    proteinGoal: number;
    weightGoal: number;
}

import { ReactNode } from 'react';
import z from 'zod';

export const enum tabKeys {
    DASHBOARD = 'dashboard',
    HISTORY = 'history',
    STATISTICS = 'stats',
}

export interface Tab {
    key: tabKeys;
    icon: ReactNode;
    pageComponent: ReactNode;
    classNames: string;
}

export type UserDTO = Pick<PrismaUser, 'id' | 'email' | 'role' | 'fullName'>;

export type ProfileDTO = Pick<
    PrismaProfile,
    'age' | 'height' | 'weight' | 'targetWeight' | 'calorieGoal' | 'proteinGoal'
>;

export interface UserDetails {
    user: UserDTO;
    profile: ProfileDTO;
}

export interface AuthPayload {
    sub: UserDTO['id'];
    user: UserDTO;
    iat: number;
    exp: number;
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

// type StepActionResponse = {
//     userId?: string;
//     success: boolean;
// };

// interface FormStep {
//     id: string;
//     title: string;
//     description: string;
//     schema: z.ZodSchema<any>;
//     fields: { name: string; label: string; type: string; placeholder: string }[];
//     submitLabel: string;
//     // הפונקציה שמבצעת את הקריאה ל-API
//     action: (data: any, userId: string | null) => Promise<StepActionResponse>;
// }
