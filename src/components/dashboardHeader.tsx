'use client';

import { useNutrition } from '@/contexts/nutritionContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getDateString } from '@/contexts/nutritionStore';

export function DashboardHeader() {
    const { selectedDate, setSelectedDate } = useNutrition();

    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const weekAgo = new Date();
    weekAgo.setDate(new Date().getDate() - 6);
    const isToday = getDateString(selectedDate) === getDateString(new Date());
    const isAtLimit = getDateString(selectedDate) === getDateString(weekAgo);

    const formatDate = (date: Date) => {
        if (isToday) return 'Today';
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (getDateString(date) === getDateString(yesterday))
            return 'Yesterday';

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousDay}
                    disabled={isAtLimit}
                    className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span className="text-sm sm:text-lg font-medium">
                        {formatDate(selectedDate)}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextDay}
                    disabled={isToday}
                    className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            </div>

            {!isToday && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                >
                    Go to Today
                </Button>
            )}
        </div>
    );
}
