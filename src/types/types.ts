import { ActivityLevel } from '@prisma/client';
import { ReactNode } from 'react';
import { FoodEntryDTO, UserDTO } from './dto';

export interface SavedFood {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
}

export interface DailyLog {
    date: string; // YYYY-MM-DD format
    entries: FoodEntryDTO[];
    calorieGoal: number;
    proteinGoal: number;
}

export interface NutritionGoals {
    calorieGoal: number;
    proteinGoal: number;
    weightGoal: number;
}

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
