import { MagicAIEntry } from '../magicAIEntry';
import { DashboardHeader } from '../dashboardHeader';
import { DailyProgress } from '../dailyProgress';
import { FoodLog } from '../foodLog';
import { useCallback } from 'react';
import { useNutrition } from '@/contexts/nutritionContext';
import { WeightMiniCard } from '../WeightMiniCard';

export const Dashboard = () => {
    const { addFoodEntry } = useNutrition();

    const handleAIParsedEntry = useCallback(
        (entries: { name: string; calories: number; protein: number }[]) => {
            entries.forEach((entry) => {
                addFoodEntry({
                    ...entry,
                    notes: 'none',
                });
            });
        },
        [addFoodEntry],
    );

    return (
        <>
            <MagicAIEntry onParsedEntry={handleAIParsedEntry} />
            <DashboardHeader />
            <div className="flex flex-col gap-6">
                <DailyProgress />
                <WeightMiniCard
                    currentWeight={60.0}
                    targetWeight={70.0}
                    trend="-0.4"
                />
                <FoodLog />
            </div>
        </>
    );
};
