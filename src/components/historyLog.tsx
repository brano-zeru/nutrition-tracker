'use client';

import { useState, useEffect, useMemo } from 'react';
import { useNutrition } from '@/contexts/nutritionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Flame, Dumbbell, ChevronRight } from 'lucide-react';
import { getDateString } from '@/contexts/nutritionStore';
import { cn } from '@/lib/utils';

export function HistoryLog() {
    const { dailyLogs, setSelectedDate, selectedDate, goals } = useNutrition();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Memoize the days array to avoid recalculating on every render
    const days = useMemo(() => {
        const result: { date: Date; dateStr: string }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            result.push({
                date,
                dateStr: getDateString(date),
            });
        }

        return result;
    }, [mounted]); // Re-run only when mounted changes
    const selectedDateStr = getDateString(selectedDate);

    const formatDayLabel = (date: Date, index: number) => {
        if (index === 0) return 'Today';
        if (index === 1) return 'Yesterday';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Don't render dynamic content until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <Card className="border-border/50 bg-card h-fit">
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="h-[320px] sm:h-[380px] flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            Loading...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 bg-card h-fit">
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    History
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[320px] sm:h-[380px]">
                    <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-1.5 sm:space-y-2">
                        {days.map(({ date, dateStr }, index) => {
                            const log = dailyLogs[dateStr];
                            const totalCalories =
                                log?.entries.reduce(
                                    (sum, e) => sum + e.calories,
                                    0,
                                ) || 0;
                            const totalProtein =
                                log?.entries.reduce(
                                    (sum, e) => sum + e.protein,
                                    0,
                                ) || 0;
                            const entriesCount = log?.entries.length || 0;
                            const isSelected = dateStr === selectedDateStr;
                            const calorieProgress = Math.min(
                                (totalCalories / goals.calorieGoal) * 100,
                                100,
                            );

                            return (
                                <Button
                                    key={dateStr}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start h-auto py-3 sm:py-4 px-3 sm:px-4 rounded-lg hover:bg-secondary/50',
                                        isSelected &&
                                            'bg-secondary ring-1 ring-primary/50',
                                    )}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                            <span
                                                className={cn(
                                                    'font-medium text-sm sm:text-base',
                                                    isSelected &&
                                                        'text-primary',
                                                )}
                                            >
                                                {formatDayLabel(date, index)}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                                    {entriesCount}{' '}
                                                    {entriesCount === 1
                                                        ? 'entry'
                                                        : 'entries'}
                                                </span>
                                                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                            </div>
                                        </div>

                                        {entriesCount > 0 ? (
                                            <>
                                                <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm mb-1.5 sm:mb-2">
                                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                                        <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-calories" />
                                                        <span className="text-calories font-medium">
                                                            {totalCalories}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            cal
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                                        <Dumbbell className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-protein" />
                                                        <span className="text-protein font-medium">
                                                            {Math.round(
                                                                totalProtein,
                                                            )}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            g
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Mini progress bar */}
                                                <div className="h-1 sm:h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-calories to-primary transition-all duration-300"
                                                        style={{
                                                            width: `${calorieProgress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                No entries logged
                                            </p>
                                        )}
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
