import { TabsContent } from "@radix-ui/react-tabs"
import { MagicAIEntry } from "../magicAIEntry"
import { DashboardHeader } from "../dashboardHeader"
import { DailyProgress } from "../dailyProgress"
import { FoodLog } from "../foodLog"
import { HistoryLog } from "../historyLog"
import { useCallback } from "react"
import { useNutrition } from "@/contexts/nutritionContext"

export const Dashboard = () => {
    const {addFoodEntry} = useNutrition()

    const handleAIParsedEntry = useCallback((entries: { name: string; calories: number; protein: number }[]) => {
        entries.forEach(entry => {
        addFoodEntry({
            ...entry,
            notes: 'none',
        })
        })
    }, [addFoodEntry])

    return (
      <>
            <MagicAIEntry onParsedEntry={handleAIParsedEntry} />
            <DashboardHeader />
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <DailyProgress />
                <FoodLog />
              </div>
              
              <div className="hidden lg:block lg:col-span-1">
                <HistoryLog />
              </div>
            </div>
      </>
    )
}