'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Dumbbell } from 'lucide-react';
import { ProgressStat } from './ProgressStat';
import { useProfile } from '@/hooks/useProfile';
import { useDailyProgress } from '@/hooks/useDailyProgress';

export function DailyProgress() {
    const { currentDailyCalories, currentDailyProtein } = useDailyProgress();
    const { goals, isLoading } = useProfile();

    //should be replaced with a skeleton loader
    if (isLoading || !goals) return <></>;

    return (
        <Card className="border-border/50 bg-card">
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-medium">
                    Daily Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 px-2 sm:px-0">
                    <ProgressStat
                        label="Calories"
                        value={currentDailyCalories}
                        goal={goals.calorieGoal}
                        icon={Flame}
                        colorVar="var(--calories)"
                        iconColorClass="text-calories"
                        indicatorClass="[&>[data-slot=progress-indicator]]:bg-calories"
                    />
                    <ProgressStat
                        label="Protein"
                        value={currentDailyProtein}
                        goal={goals.proteinGoal}
                        unit="g"
                        icon={Dumbbell}
                        colorVar="var(--protein)"
                        iconColorClass="text-protein"
                        indicatorClass="[&>[data-slot=progress-indicator]]:bg-protein"
                    />
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                            Remaining
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-calories mt-0.5 sm:mt-1">
                            {Math.max(
                                0,
                                goals.calorieGoal - currentDailyCalories,
                            )}{' '}
                            cal
                        </p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
                            Remaining
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-protein mt-0.5 sm:mt-1">
                            {Math.max(
                                0,
                                goals.proteinGoal - currentDailyProtein,
                            )}
                            g protein
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
