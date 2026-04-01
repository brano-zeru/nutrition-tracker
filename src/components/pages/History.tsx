import { TabsContent } from '@radix-ui/react-tabs';
import { HistoryLog } from '../historyLog';
import { DashboardHeader } from '../dashboardHeader';
import { DailyProgress } from '../dailyProgress';
import { FoodLog } from '../foodLog';

export const History = () => {
    return (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <HistoryLog />
            <div className="space-y-4 sm:space-y-6">
                <DashboardHeader />
                <DailyProgress />
                <FoodLog />
            </div>
        </div>
    );
};
