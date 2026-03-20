import { FoodEntry, SavedFood, DailyLog, NutritionGoals } from './types'

// Helper to get date string in YYYY-MM-DD format
export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Initial saved foods (common foods library)
export const initialSavedFoods: SavedFood[] = [
  { id: '1', name: 'Chicken Breast', caloriesPer100g: 165, proteinPer100g: 31 },
  { id: '2', name: 'Eggs (whole)', caloriesPer100g: 155, proteinPer100g: 13 },
  { id: '3', name: 'Greek Yogurt', caloriesPer100g: 97, proteinPer100g: 9 },
  { id: '4', name: 'Salmon', caloriesPer100g: 208, proteinPer100g: 20 },
  { id: '5', name: 'Tuna (canned)', caloriesPer100g: 116, proteinPer100g: 26 },
  { id: '6', name: 'Brown Rice', caloriesPer100g: 112, proteinPer100g: 2.6 },
  { id: '7', name: 'Oatmeal', caloriesPer100g: 68, proteinPer100g: 2.4 },
  { id: '8', name: 'Banana', caloriesPer100g: 89, proteinPer100g: 1.1 },
  { id: '9', name: 'Apple', caloriesPer100g: 52, proteinPer100g: 0.3 },
  { id: '10', name: 'Broccoli', caloriesPer100g: 34, proteinPer100g: 2.8 },
  { id: '11', name: 'Sweet Potato', caloriesPer100g: 86, proteinPer100g: 1.6 },
  { id: '12', name: 'Almonds', caloriesPer100g: 579, proteinPer100g: 21 },
  { id: '13', name: 'Cottage Cheese', caloriesPer100g: 98, proteinPer100g: 11 },
  { id: '14', name: 'Whey Protein', caloriesPer100g: 360, proteinPer100g: 80 },
  { id: '15', name: 'Beef (lean)', caloriesPer100g: 250, proteinPer100g: 26 },
]

// Sample historical data for demonstration
// Using fixed values to avoid hydration mismatches (no Math.random())
const sampleDayData = [
  { breakfast: 320, lunch: 480, dinner: 620, snack: 150 },
  { breakfast: 290, lunch: 520, dinner: 580, snack: 180 },
  { breakfast: 350, lunch: 450, dinner: 650, snack: 120 },
  { breakfast: 280, lunch: 500, dinner: 700, snack: 200 },
  { breakfast: 310, lunch: 470, dinner: 550, snack: 160 },
  { breakfast: 340, lunch: 510, dinner: 620, snack: 140 },
]

export function generateSampleData(): Record<string, DailyLog> {
  const data: Record<string, DailyLog> = {}
  const today = new Date()
  
  // Generate data for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0) // Normalize to midnight to avoid time-based mismatches
    const dateStr = getDateString(date)
    
    const entries: FoodEntry[] = []
    
    // Add sample entries
    if (i === 0) {
      // Today - fewer entries
      const breakfastTime = new Date(date)
      breakfastTime.setHours(8, 30, 0, 0)
      const lunchTime = new Date(date)
      lunchTime.setHours(12, 30, 0, 0)
      
      entries.push({
        id: `${dateStr}-1`,
        name: 'Oatmeal with banana',
        calories: 320,
        protein: 12,
        notes: 'Breakfast',
        timestamp: breakfastTime,
      })
      entries.push({
        id: `${dateStr}-2`,
        name: 'Chicken salad',
        calories: 450,
        protein: 35,
        notes: 'Lunch',
        timestamp: lunchTime,
      })
    } else {
      // Past days - use fixed sample data
      const dayData = sampleDayData[i - 1] || sampleDayData[0]
      
      const breakfastTime = new Date(date)
      breakfastTime.setHours(8, 0, 0, 0)
      const lunchTime = new Date(date)
      lunchTime.setHours(12, 30, 0, 0)
      const snackTime = new Date(date)
      snackTime.setHours(15, 30, 0, 0)
      const dinnerTime = new Date(date)
      dinnerTime.setHours(19, 0, 0, 0)
      
      entries.push({
        id: `${dateStr}-1`,
        name: 'Breakfast',
        calories: dayData.breakfast,
        protein: Math.floor(dayData.breakfast * 0.15 / 4),
        notes: '',
        timestamp: breakfastTime,
      })
      entries.push({
        id: `${dateStr}-2`,
        name: 'Lunch',
        calories: dayData.lunch,
        protein: Math.floor(dayData.lunch * 0.25 / 4),
        notes: '',
        timestamp: lunchTime,
      })
      entries.push({
        id: `${dateStr}-3`,
        name: 'Dinner',
        calories: dayData.dinner,
        protein: Math.floor(dayData.dinner * 0.3 / 4),
        notes: '',
        timestamp: dinnerTime,
      })
      entries.push({
        id: `${dateStr}-4`,
        name: 'Snack',
        calories: dayData.snack,
        protein: Math.floor(dayData.snack * 0.1 / 4),
        notes: '',
        timestamp: snackTime,
      })
    }
    
    data[dateStr] = {
      date: dateStr,
      entries,
      calorieGoal: 2000,
      proteinGoal: 150,
    }
  }
  
  return data
}

export const defaultGoals: NutritionGoals = {
  calorieGoal: 2000,
  proteinGoal: 150,
}
