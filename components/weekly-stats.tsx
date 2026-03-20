'use client'

import { useNutrition } from '@/lib/nutrition-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Flame, Dumbbell, BarChart3 } from 'lucide-react'

const chartConfig = {
  calories: {
    label: 'Calories',
    color: 'var(--calories)',
  },
  protein: {
    label: 'Protein',
    color: 'var(--protein)',
  },
}

export function WeeklyStats() {
  const { getWeeklyStats, goals } = useNutrition()
  
  const weeklyData = getWeeklyStats()
  
  const totalCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0)
  const totalProtein = weeklyData.reduce((sum, day) => sum + day.protein, 0)
  const daysWithData = weeklyData.filter(day => day.calories > 0).length
  
  const avgCalories = daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0
  const avgProtein = daysWithData > 0 ? Math.round(totalProtein / daysWithData) : 0
  
  const caloriesDiff = avgCalories - goals.calorieGoal
  const proteinDiff = avgProtein - goals.proteinGoal
  
  const CalorieTrend = caloriesDiff > 50 ? TrendingUp : caloriesDiff < -50 ? TrendingDown : Minus
  const ProteinTrend = proteinDiff > 5 ? TrendingUp : proteinDiff < -5 ? TrendingDown : Minus
  
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          Weekly Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-calories" />
                <span className="text-sm text-muted-foreground">Avg Calories</span>
              </div>
              <CalorieTrend className={`h-4 w-4 ${
                caloriesDiff > 50 ? 'text-calories' : 
                caloriesDiff < -50 ? 'text-success' : 
                'text-muted-foreground'
              }`} />
            </div>
            <p className="text-2xl font-bold text-calories">{avgCalories}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {caloriesDiff > 0 ? '+' : ''}{caloriesDiff} from goal
            </p>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-protein" />
                <span className="text-sm text-muted-foreground">Avg Protein</span>
              </div>
              <ProteinTrend className={`h-4 w-4 ${
                proteinDiff > 5 ? 'text-success' : 
                proteinDiff < -5 ? 'text-calories' : 
                'text-muted-foreground'
              }`} />
            </div>
            <p className="text-2xl font-bold text-protein">{avgProtein}g</p>
            <p className="text-xs text-muted-foreground mt-1">
              {proteinDiff > 0 ? '+' : ''}{proteinDiff}g from goal
            </p>
          </div>
        </div>
        
        {/* Calorie Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Daily Calories</h4>
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
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
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Daily Protein</h4>
          <ChartContainer config={chartConfig} className="h-[160px] w-full">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
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
        <div className="mt-6 pt-6 border-t border-border/50">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Weekly Totals</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Days Logged</p>
              <p className="text-xl font-bold">{daysWithData}/7</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Calories</p>
              <p className="text-xl font-bold text-calories">{totalCalories.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Protein</p>
              <p className="text-xl font-bold text-protein">{totalProtein}g</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
