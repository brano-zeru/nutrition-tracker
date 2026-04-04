'use client';

import { useNutrition } from '@/contexts/nutritionContext';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
    ReferenceLine,
} from 'recharts';

const mockData = [
    { day: 'Sun', date: 28, weight: 85.5 },
    { day: 'Mon', date: 29, weight: 85.2 },
    { day: 'Tue', date: 30, weight: 84.8 },
    { day: 'Wed', date: 31, weight: 85.0 },
    { day: 'Thu', date: 1, weight: 84.5 },
    { day: 'Fri', date: 2, weight: 84.2 },
    { day: 'Sat', date: 3, weight: 84.0 },
];

const GOAL_WEIGHT = 86;

export default function WeightProgressChart() {
    const { selectedDate } = useNutrition();
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={mockData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                    <defs>
                        <linearGradient
                            id="colorWeight"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        dy={10}
                        padding={{ left: 20 }}
                    />

                    <YAxis hide domain={[GOAL_WEIGHT - 2, 'dataMax + 1']} />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: 'none',
                            borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#10b981' }}
                        labelStyle={{ display: 'none' }}
                    />

                    <ReferenceLine
                        y={GOAL_WEIGHT}
                        stroke="#71717a"
                        strokeDasharray="5 5"
                        label={{
                            value: 'GOAL',
                            position: 'right',
                            fill: '#71717a',
                            fontSize: 10,
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorWeight)"
                        isAnimationActive={true}
                        activeDot={{
                            r: 8,
                            strokeWidth: 2,
                            stroke: '#10b981',
                            fill: '#09090b',
                        }}
                        dot={(props) => {
                            const { cx, cy, payload } = props;
                            const isSelected =
                                payload.date === selectedDate.getDate();
                            return (
                                <circle
                                    key={payload.day}
                                    cx={cx}
                                    cy={cy}
                                    r={isSelected ? 6 : 0}
                                    fill="#10b981"
                                />
                            );
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
