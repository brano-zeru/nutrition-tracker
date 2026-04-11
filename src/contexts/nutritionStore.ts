import { NutritionGoals } from '../types/types';

// Helper to get date string in YYYY-MM-DD format (using local timezone)
export function getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const defaultGoals: NutritionGoals = {
    calorieGoal: 2000,
    proteinGoal: 150,
    weightGoal: 100,
};
