import { useMemo } from 'react';
import { useFoodLogs } from './useFoodLogs';

interface DailyProgressProps {
    currentDailyCalories: number;
    currentDailyProtein: number;
}

export const useDailyProgress = (): DailyProgressProps => {
    const { currentDayFoodLogEntries } = useFoodLogs();

    const { currentDailyCalories, currentDailyProtein } = useMemo(() => {
        if (!currentDayFoodLogEntries) {
            return { currentDailyCalories: 0, currentDailyProtein: 0 };
        }

        return currentDayFoodLogEntries.reduce(
            (acc, entry) => {
                acc.currentDailyCalories += entry.calories;
                acc.currentDailyProtein += entry.protein;
                return acc;
            },
            { currentDailyCalories: 0, currentDailyProtein: 0 },
        );
    }, [currentDayFoodLogEntries]);

    return { currentDailyCalories, currentDailyProtein };
};
