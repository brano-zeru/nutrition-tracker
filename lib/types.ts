export interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  notes: string
  timestamp: Date
}

export interface SavedFood {
  id: string
  name: string
  caloriesPer100g: number
  proteinPer100g: number
}

export interface DailyLog {
  date: string // YYYY-MM-DD format
  entries: FoodEntry[]
  calorieGoal: number
  proteinGoal: number
}

export interface NutritionGoals {
  calorieGoal: number
  proteinGoal: number
}
