'use client';

import { useNutrition } from '@/contexts/nutritionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    ReferenceLine,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Flame,
    Dumbbell,
    BarChart3,
    PieChart as PieChartIcon,
} from 'lucide-react';

const chartConfig = {
    calories: {
        label: 'Calories',
        color: 'var(--calories)',
    },
    protein: {
        label: 'Protein',
        color: 'var(--protein)',
    },
};

const FOOD_COLORS = [
    'hsl(var(--primary))',
    'var(--calories)',
    'var(--protein)',
    'hsl(142 76% 36%)',
    'hsl(48 96% 53%)',
    'hsl(280 87% 65%)',
    'hsl(188 78% 41%)',
    'hsl(25 95% 53%)',
];

export function WeeklyStats() {
    const { getWeeklyStats, getTopFoods, goals } = useNutrition();

    const weeklyData = getWeeklyStats();
    const topFoods = getTopFoods();

    const totalCalories = weeklyData.reduce(
        (sum, day) => sum + day.calories,
        0,
    );
    const totalProtein = weeklyData.reduce((sum, day) => sum + day.protein, 0);
    const daysWithData = weeklyData.filter((day) => day.calories > 0).length;

    const avgCalories =
        daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0;
    const avgProtein =
        daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0;

    const caloriesDiff = avgCalories - goals.calorieGoal;
    const proteinDiff = avgProtein - goals.proteinGoal;

    const CalorieTrend =
        caloriesDiff > 50
            ? TrendingUp
            : caloriesDiff < -50
              ? TrendingDown
              : Minus;
    const ProteinTrend =
        proteinDiff > 5 ? TrendingUp : proteinDiff < -5 ? TrendingDown : Minus;

    // Calculate max values for chart Y-axis (include goal line)
    const maxCalories =
        Math.max(...weeklyData.map((d) => d.calories), goals.calorieGoal) * 1.1;
    const maxProtein =
        Math.max(...weeklyData.map((d) => d.protein), goals.proteinGoal) * 1.1;

    // Prepare top foods data for pie chart
    const topFoodsData = topFoods.slice(0, 6).map((food, index) => ({
        name: food.name,
        value: food.count,
        calories: food.calories,
        fill: FOOD_COLORS[index % FOOD_COLORS.length],
    }));

    return (
        <div className="space-y-4 sm:space-y-6">
            <Card className="border-border/50 bg-card">
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        Weekly Stats
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-calories" />
                                    <span className="text-xs sm:text-sm text-muted-foreground">
                                        Avg Calories
                                    </span>
                                </div>
                                <CalorieTrend
                                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                        caloriesDiff > 50
                                            ? 'text-calories'
                                            : caloriesDiff < -50
                                              ? 'text-success'
                                              : 'text-muted-foreground'
                                    }`}
                                />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-calories">
                                {avgCalories}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                                {caloriesDiff > 0 ? '+' : ''}
                                {caloriesDiff} from goal
                            </p>
                        </div>

                        <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Dumbbell className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-protein" />
                                    <span className="text-xs sm:text-sm text-muted-foreground">
                                        Avg Protein
                                    </span>
                                </div>
                                <ProteinTrend
                                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                        proteinDiff > 5
                                            ? 'text-success'
                                            : proteinDiff < -5
                                              ? 'text-calories'
                                              : 'text-muted-foreground'
                                    }`}
                                />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-protein">
                                {avgProtein}g
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                                {proteinDiff > 0 ? '+' : ''}
                                {proteinDiff}g from goal
                            </p>
                        </div>
                    </div>

                    {/* Calorie Chart */}
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                Daily Calories
                            </h4>
                            <span className="text-[10px] sm:text-xs text-calories">
                                Goal: {goals.calorieGoal}
                            </span>
                        </div>
                        <ChartContainer
                            config={chartConfig}
                            className="h-[140px] sm:h-[160px] w-full"
                        >
                            <BarChart
                                data={weeklyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 10,
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 10,
                                    }}
                                    width={35}
                                    domain={[0, maxCalories]}
                                    tickFormatter={(value) =>
                                        value >= 1000
                                            ? `${(value / 1000).toFixed(1)}k`
                                            : value
                                    }
                                />
                                <ReferenceLine
                                    y={goals.calorieGoal}
                                    stroke="var(--calories)"
                                    strokeDasharray="4 4"
                                    strokeWidth={1.5}
                                    strokeOpacity={0.7}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="calories"
                                    fill="var(--calories)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ChartContainer>
                    </div>

                    {/* Protein Chart */}
                    <div>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                Daily Protein
                            </h4>
                            <span className="text-[10px] sm:text-xs text-protein">
                                Goal: {goals.proteinGoal}g
                            </span>
                        </div>
                        <ChartContainer
                            config={chartConfig}
                            className="h-[140px] sm:h-[160px] w-full"
                        >
                            <BarChart
                                data={weeklyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 10,
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 10,
                                    }}
                                    width={35}
                                    domain={[0, maxProtein]}
                                />
                                <ReferenceLine
                                    y={goals.proteinGoal}
                                    stroke="var(--protein)"
                                    strokeDasharray="4 4"
                                    strokeWidth={1.5}
                                    strokeOpacity={0.7}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="protein"
                                    fill="var(--protein)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ChartContainer>
                    </div>

                    {/* Weekly Totals */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50">
                        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                            Weekly Totals
                        </h4>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                    Days Logged
                                </p>
                                <p className="text-lg sm:text-xl font-bold">
                                    {daysWithData}/7
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                    Total Calories
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-calories">
                                    {totalCalories.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                    Total Protein
                                </p>
                                <p className="text-lg sm:text-xl font-bold text-protein">
                                    {totalProtein}g
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Foods Card */}
            <Card className="border-border/50 bg-card">
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        Most Eaten Foods
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                    {topFoodsData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Pie Chart */}
                            <div className="h-[180px] sm:h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topFoodsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {topFoodsData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.fill}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    const data =
                                                        payload[0].payload;
                                                    return (
                                                        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                                                            <p className="font-medium text-sm">
                                                                {data.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {data.value}{' '}
                                                                times - Avg{' '}
                                                                {data.calories}{' '}
                                                                cal
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend List */}
                            <div className="space-y-2">
                                {topFoodsData.map((food, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-1.5 sm:py-2"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: food.fill,
                                                }}
                                            />
                                            <span className="text-xs sm:text-sm truncate">
                                                {food.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                            <span className="text-xs text-muted-foreground">
                                                {food.value}x
                                            </span>
                                            <span className="text-xs font-medium text-calories">
                                                {food.calories} cal
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No food data available yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
