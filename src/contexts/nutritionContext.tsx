'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from 'react';
import { SavedFood, DailyLog, NutritionGoals } from '../types';

import { getDateString, defaultGoals } from './nutritionStore';

interface NutritionContextType {
    // Current date
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;

    // Daily logs
    dailyLogs: Record<string, DailyLog>;
    getCurrentDayLog: () => DailyLog;

    // Saved foods
    savedFoods: SavedFood[];
    removeSavedFood: (foodId: string) => void;

    // Goals
    goals: NutritionGoals;
    updateGoals: (goals: NutritionGoals) => void;

    // Stats
    getTotalCalories: (date?: Date) => number;
    getTotalProtein: (date?: Date) => number;
    getWeeklyStats: () => { date: string; calories: number; protein: number }[];
    getTopFoods: () => { name: string; count: number; calories: number }[];
}

const NutritionContext = createContext<NutritionContextType | null>(null);

export function NutritionProvider({ children }: { children: React.ReactNode }) {
    const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
    const [dailyLogs, _setDailyLogs] = useState<Record<string, DailyLog>>({});
    const [savedFoods, setSavedFoods] = useState<SavedFood[]>([]);
    const [goals, setGoals] = useState<NutritionGoals>(defaultGoals);

    const getCurrentDayLog = useCallback((): DailyLog => {
        const dateStr = getDateString(selectedDate);
        return (
            dailyLogs[dateStr] || {
                date: dateStr,
                entries: [],
                calorieGoal: goals.calorieGoal,
                proteinGoal: goals.proteinGoal,
            }
        );
    }, [selectedDate, dailyLogs, goals]);

    const addSavedFood = useCallback((food: Omit<SavedFood, 'id'>) => {
        const newFood: SavedFood = {
            ...food,
            id: `saved-${Date.now()}`,
        };
        setSavedFoods((prev) => [...prev, newFood]);
    }, []);

    const removeSavedFood = useCallback((foodId: string) => {
        setSavedFoods((prev) => prev.filter((f) => f.id !== foodId));
    }, []);

    const updateGoals = useCallback((newGoals: NutritionGoals) => {
        setGoals(newGoals);
    }, []);

    const getTotalCalories = useCallback(
        (date?: Date): number => {
            const dateStr = getDateString(date || selectedDate);
            const log = dailyLogs[dateStr];
            if (!log) return 0;
            return log.entries.reduce((sum, entry) => sum + entry.calories, 0);
        },
        [dailyLogs, selectedDate],
    );

    const getTotalProtein = useCallback(
        (date?: Date): number => {
            const dateStr = getDateString(date || selectedDate);
            const log = dailyLogs[dateStr];
            if (!log) return 0;
            return log.entries.reduce((sum, entry) => sum + entry.protein, 0);
        },
        [dailyLogs, selectedDate],
    );

    const getWeeklyStats = useCallback(() => {
        const stats: { date: string; calories: number; protein: number }[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = getDateString(date);
            const log = dailyLogs[dateStr];

            const dayName = date.toLocaleDateString('en-US', {
                weekday: 'short',
            });

            stats.push({
                date: dayName,
                calories: log
                    ? log.entries.reduce((sum, e) => sum + e.calories, 0)
                    : 0,
                protein: log
                    ? log.entries.reduce((sum, e) => sum + e.protein, 0)
                    : 0,
            });
        }

        return stats;
    }, [dailyLogs]);

    const getTopFoods = useCallback(() => {
        const foodCounts: Record<
            string,
            { count: number; totalCalories: number }
        > = {};

        // Go through all logs
        Object.values(dailyLogs).forEach((log) => {
            log.entries.forEach((entry) => {
                // Normalize name - remove quantity info in parentheses
                const baseName = entry.name
                    .replace(/\s*\([^)]*\)\s*/g, '')
                    .trim();

                if (!foodCounts[baseName]) {
                    foodCounts[baseName] = { count: 0, totalCalories: 0 };
                }
                foodCounts[baseName].count += 1;
                foodCounts[baseName].totalCalories += entry.calories;
            });
        });

        // Convert to array and sort by count
        return Object.entries(foodCounts)
            .map(([name, data]) => ({
                name,
                count: data.count,
                calories: Math.round(data.totalCalories / data.count), // average calories per serving
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [dailyLogs]);

    const value = useMemo(
        () => ({
            selectedDate,
            setSelectedDate,
            dailyLogs,
            getCurrentDayLog,
            savedFoods,
            addSavedFood,
            removeSavedFood,
            goals,
            updateGoals,
            getTotalCalories,
            getTotalProtein,
            getWeeklyStats,
            getTopFoods,
        }),
        [
            selectedDate,
            dailyLogs,
            getCurrentDayLog,
            savedFoods,
            addSavedFood,
            removeSavedFood,
            goals,
            updateGoals,
            getTotalCalories,
            getTotalProtein,
            getWeeklyStats,
            getTopFoods,
        ],
    );

    return (
        <NutritionContext.Provider value={value}>
            {children}
        </NutritionContext.Provider>
    );
}

export function useNutrition() {
    const context = useContext(NutritionContext);
    if (!context) {
        throw new Error('useNutrition must be used within a NutritionProvider');
    }
    return context;
}
