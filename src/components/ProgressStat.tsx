'use client';

import { ProgressRing } from '@/components/progressRing';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface ProgressStatProps {
    label: string;
    value: number;
    goal: number;
    unit?: string;
    icon: LucideIcon;
    colorVar: string;
    iconColorClass: string;
    indicatorClass: string;
}

export function ProgressStat({
    label,
    value,
    goal,
    unit = '',
    icon: Icon,
    colorVar,
    iconColorClass,
    indicatorClass,
}: ProgressStatProps) {
    const percentage = Math.min((value / goal) * 100, 100);

    return (
        <div className="flex flex-col items-center">
            <ProgressRing
                value={value}
                max={goal}
                size={180}
                strokeWidth={10}
                color={colorVar}
                bgColor="var(--secondary)"
                className="flex item-center justify-center"
            >
                <div className="flex flex-col items-center">
                    <Icon className={`h-5 w-5 mb-1 ${iconColorClass}`} />
                    <span className="text-2xl font-bold">
                        {Math.round(value)}
                        {unit}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        / {goal}
                        {unit}
                    </span>
                </div>
            </ProgressRing>

            <div className="mt-3 sm:mt-4 w-full">
                <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">
                        {Math.round(percentage)}%
                    </span>
                </div>
                <Progress
                    value={percentage}
                    className={`h-1.5 sm:h-2 bg-secondary ${indicatorClass}`}
                />
            </div>
        </div>
    );
}
