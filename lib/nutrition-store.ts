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
export function generateSampleData(): Record<string, DailyLog> {
  const data: Record<string, DailyLog> = {}
  const today = new Date()
  
  // Generate data for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = getDateString(date)
    
    const entries: FoodEntry[] = []
    
    // Add sample entries
    if (i === 0) {
      // Today - fewer entries
      entries.push({
        id: `${dateStr}-1`,
        name: 'Oatmeal with banana',
        calories: 320,
        protein: 12,
        notes: 'Breakfast',
        timestamp: new Date(date.setHours(8, 30)),
      })
      entries.push({
        id: `${dateStr}-2`,
        name: 'Chicken salad',
        calories: 450,
        protein: 35,
        notes: 'Lunch',
        timestamp: new Date(date.setHours(12, 30)),
      })
    } else {
      // Past days - full data
      const breakfastCal = 250 + Math.floor(Math.random() * 150)
      const lunchCal = 400 + Math.floor(Math.random() * 200)
      const dinnerCal = 500 + Math.floor(Math.random() * 300)
      const snackCal = 100 + Math.floor(Math.random() * 150)
      
      entries.push({
        id: `${dateStr}-1`,
        name: 'Breakfast',
        calories: breakfastCal,
        protein: Math.floor(breakfastCal * 0.15 / 4),
        notes: '',
        timestamp: new Date(date.setHours(8, 0)),
      })
      entries.push({
        id: `${dateStr}-2`,
        name: 'Lunch',
        calories: lunchCal,
        protein: Math.floor(lunchCal * 0.25 / 4),
        notes: '',
        timestamp: new Date(date.setHours(12, 30)),
      })
      entries.push({
        id: `${dateStr}-3`,
        name: 'Dinner',
        calories: dinnerCal,
        protein: Math.floor(dinnerCal * 0.3 / 4),
        notes: '',
        timestamp: new Date(date.setHours(19, 0)),
      })
      entries.push({
        id: `${dateStr}-4`,
        name: 'Snack',
        calories: snackCal,
        protein: Math.floor(snackCal * 0.1 / 4),
        notes: '',
        timestamp: new Date(date.setHours(15, 30)),
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
