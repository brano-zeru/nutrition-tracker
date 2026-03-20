'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { FoodEntry, SavedFood, DailyLog, NutritionGoals } from './types'
import { 
  initialSavedFoods, 
  generateSampleData, 
  getDateString, 
  defaultGoals 
} from './nutrition-store'

interface NutritionContextType {
  // Current date
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  
  // Daily logs
  dailyLogs: Record<string, DailyLog>
  getCurrentDayLog: () => DailyLog
  
  // Food entries
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void
  removeFoodEntry: (entryId: string) => void
  
  // Saved foods
  savedFoods: SavedFood[]
  addSavedFood: (food: Omit<SavedFood, 'id'>) => void
  removeSavedFood: (foodId: string) => void
  addSavedFoodToDay: (food: SavedFood, grams: number) => void
  
  // Goals
  goals: NutritionGoals
  updateGoals: (goals: NutritionGoals) => void
  
  // Stats
  getTotalCalories: (date?: Date) => number
  getTotalProtein: (date?: Date) => number
  getWeeklyStats: () => { date: string; calories: number; protein: number }[]
}

const NutritionContext = createContext<NutritionContextType | null>(null)

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(generateSampleData)
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>(initialSavedFoods)
  const [goals, setGoals] = useState<NutritionGoals>(defaultGoals)
  
  const getCurrentDayLog = useCallback((): DailyLog => {
    const dateStr = getDateString(selectedDate)
    return dailyLogs[dateStr] || {
      date: dateStr,
      entries: [],
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.proteinGoal,
    }
  }, [selectedDate, dailyLogs, goals])
  
  const addFoodEntry = useCallback((entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const dateStr = getDateString(selectedDate)
    const newEntry: FoodEntry = {
      ...entry,
      id: `${dateStr}-${Date.now()}`,
      timestamp: new Date(),
    }
    
    setDailyLogs(prev => {
      const currentLog = prev[dateStr] || {
        date: dateStr,
        entries: [],
        calorieGoal: goals.calorieGoal,
        proteinGoal: goals.proteinGoal,
      }
      
      return {
        ...prev,
        [dateStr]: {
          ...currentLog,
          entries: [...currentLog.entries, newEntry],
        },
      }
    })
  }, [selectedDate, goals])
  
  const removeFoodEntry = useCallback((entryId: string) => {
    const dateStr = getDateString(selectedDate)
    
    setDailyLogs(prev => {
      const currentLog = prev[dateStr]
      if (!currentLog) return prev
      
      return {
        ...prev,
        [dateStr]: {
          ...currentLog,
          entries: currentLog.entries.filter(e => e.id !== entryId),
        },
      }
    })
  }, [selectedDate])
  
  const addSavedFood = useCallback((food: Omit<SavedFood, 'id'>) => {
    const newFood: SavedFood = {
      ...food,
      id: `saved-${Date.now()}`,
    }
    setSavedFoods(prev => [...prev, newFood])
  }, [])
  
  const removeSavedFood = useCallback((foodId: string) => {
    setSavedFoods(prev => prev.filter(f => f.id !== foodId))
  }, [])
  
  const addSavedFoodToDay = useCallback((food: SavedFood, grams: number) => {
    const calories = Math.round((food.caloriesPer100g * grams) / 100)
    const protein = Math.round((food.proteinPer100g * grams) / 100 * 10) / 10
    
    addFoodEntry({
      name: `${food.name} (${grams}g)`,
      calories,
      protein,
      notes: '',
    })
  }, [addFoodEntry])
  
  const updateGoals = useCallback((newGoals: NutritionGoals) => {
    setGoals(newGoals)
  }, [])
  
  const getTotalCalories = useCallback((date?: Date): number => {
    const dateStr = getDateString(date || selectedDate)
    const log = dailyLogs[dateStr]
    if (!log) return 0
    return log.entries.reduce((sum, entry) => sum + entry.calories, 0)
  }, [dailyLogs, selectedDate])
  
  const getTotalProtein = useCallback((date?: Date): number => {
    const dateStr = getDateString(date || selectedDate)
    const log = dailyLogs[dateStr]
    if (!log) return 0
    return log.entries.reduce((sum, entry) => sum + entry.protein, 0)
  }, [dailyLogs, selectedDate])
  
  const getWeeklyStats = useCallback(() => {
    const stats: { date: string; calories: number; protein: number }[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = getDateString(date)
      const log = dailyLogs[dateStr]
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      stats.push({
        date: dayName,
        calories: log ? log.entries.reduce((sum, e) => sum + e.calories, 0) : 0,
        protein: log ? log.entries.reduce((sum, e) => sum + e.protein, 0) : 0,
      })
    }
    
    return stats
  }, [dailyLogs])
  
  const value = useMemo(() => ({
    selectedDate,
    setSelectedDate,
    dailyLogs,
    getCurrentDayLog,
    addFoodEntry,
    removeFoodEntry,
    savedFoods,
    addSavedFood,
    removeSavedFood,
    addSavedFoodToDay,
    goals,
    updateGoals,
    getTotalCalories,
    getTotalProtein,
    getWeeklyStats,
  }), [
    selectedDate,
    dailyLogs,
    getCurrentDayLog,
    addFoodEntry,
    removeFoodEntry,
    savedFoods,
    addSavedFood,
    removeSavedFood,
    addSavedFoodToDay,
    goals,
    updateGoals,
    getTotalCalories,
    getTotalProtein,
    getWeeklyStats,
  ])
  
  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  )
}

export function useNutrition() {
  const context = useContext(NutritionContext)
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider')
  }
  return context
}
