'use client'

import { useNutrition } from '@/lib/nutrition-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProgressRing } from '@/components/progress-ring'
import { Flame, Dumbbell } from 'lucide-react'

export function DailyProgress() {
  const { getTotalCalories, getTotalProtein, goals } = useNutrition()
  
  const calories = getTotalCalories()
  const protein = getTotalProtein()
  const caloriePercentage = Math.min((calories / goals.calorieGoal) * 100, 100)
  const proteinPercentage = Math.min((protein / goals.proteinGoal) * 100, 100)
  
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Calories Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing
              value={calories}
              max={goals.calorieGoal}
              size={140}
              strokeWidth={10}
              color="var(--calories)"
              bgColor="var(--secondary)"
            >
              <div className="flex flex-col items-center">
                <Flame className="h-5 w-5 text-calories mb-1" />
                <span className="text-2xl font-bold">{calories}</span>
                <span className="text-xs text-muted-foreground">
                  / {goals.calorieGoal}
                </span>
              </div>
            </ProgressRing>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{Math.round(caloriePercentage)}%</span>
              </div>
              <Progress
                value={caloriePercentage}
                className="h-2 bg-secondary [&>[data-slot=progress-indicator]]:bg-calories"
              />
            </div>
          </div>
          
          {/* Protein Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing
              value={protein}
              max={goals.proteinGoal}
              size={140}
              strokeWidth={10}
              color="var(--protein)"
              bgColor="var(--secondary)"
            >
              <div className="flex flex-col items-center">
                <Dumbbell className="h-5 w-5 text-protein mb-1" />
                <span className="text-2xl font-bold">{Math.round(protein)}g</span>
                <span className="text-xs text-muted-foreground">
                  / {goals.proteinGoal}g
                </span>
              </div>
            </ProgressRing>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{Math.round(proteinPercentage)}%</span>
              </div>
              <Progress
                value={proteinPercentage}
                className="h-2 bg-secondary [&>[data-slot=progress-indicator]]:bg-protein"
              />
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Remaining</p>
            <p className="text-xl font-bold text-calories mt-1">
              {Math.max(0, goals.calorieGoal - calories)} cal
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Remaining</p>
            <p className="text-xl font-bold text-protein mt-1">
              {Math.max(0, goals.proteinGoal - protein)}g protein
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
