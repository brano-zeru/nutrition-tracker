import { MagicAIEntry } from '../magicAIEntry';
import { DashboardHeader } from '../dashboardHeader';
import { DailyProgress } from '../dailyProgress';
import { FoodLog } from '../foodLog';
import { useCallback } from 'react';
import { WeightMiniCard } from '../WeightMiniCard';

export const Dashboard = () => {
    // logic here should be replace entirely
    const handleAIParsedEntry = useCallback(
        (_entries: { name: string; calories: number; protein: number }[]) => {},
        [],
    );

    return (
        <>
            <MagicAIEntry onParsedEntry={handleAIParsedEntry} />
            <DashboardHeader />
            <div className="flex flex-col gap-6">
                <DailyProgress />
                <WeightMiniCard />
                <FoodLog />
            </div>
        </>
    );
};
