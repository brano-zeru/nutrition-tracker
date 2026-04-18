import { ActivityLevel } from '@prisma/client';

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
import { UserDTO } from './dto';

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

export interface AuthPayload {
    sub: UserDTO['id'];
    user: UserDTO;
    iat: number;
    exp: number;
}

export interface CalculationParams {
    weight: number;
    height: number;
    age: number;
    activityLevel: ActivityLevel;
}
