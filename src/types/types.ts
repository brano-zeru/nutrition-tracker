import { User as PrismaUser } from '@prisma/client';

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
}

import { ReactNode } from 'react';

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

export interface AuthPayload extends Omit<UserDTO, 'id'> {
    sub: UserDTO['id'];
    iat: number;
    exp: number;
}
