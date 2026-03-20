'use client'

import { useState } from 'react'
import { NutritionProvider, useNutrition } from '@/lib/nutritionContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardHeader } from '@/components/dashboardHeader'
import { DailyProgress } from '@/components/dailyProgress'
import { MagicAIEntry } from '@/components/magicAIEntry'
import { FoodLog } from '@/components/foodLog'
import { SavedFoodsLibrary } from '@/components/savedFoodsLibrary'
import { HistoryLog } from '@/components/historyLog'
import { WeeklyStats } from '@/components/weeklyStats'
import { GoalsSettings } from '@/components/goalsSettings'
import { Apple, BarChart3, History } from 'lucide-react'

function TrackerContent() {
  const { addFoodEntry } = useNutrition()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const handleAIParsedEntry = (entries: { name: string; calories: number; protein: number }[]) => {
    entries.forEach(entry => {
      addFoodEntry({
        name: entry.name,
        calories: entry.calories,
        protein: entry.protein,
        notes: 'Added via Magic AI',
      })
    })
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">NutriTrack</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Your nutrition companion</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <SavedFoodsLibrary />
              <GoalsSettings />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-secondary/50 border border-border/50 p-1 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs sm:text-sm px-2 sm:px-4"
            >
              <Apple className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs sm:text-sm px-2 sm:px-4"
            >
              <History className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs sm:text-sm px-2 sm:px-4"
            >
              <BarChart3 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* Magic AI Entry */}
            <MagicAIEntry onParsedEntry={handleAIParsedEntry} />
            
            {/* Date Navigation */}
            <DashboardHeader />
            
            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Progress & Food Log */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <DailyProgress />
                <FoodLog />
              </div>
              
              {/* History Sidebar - hidden on mobile, shown in dedicated tab */}
              <div className="hidden lg:block lg:col-span-1">
                <HistoryLog />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4 sm:mt-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <HistoryLog />
              <div className="space-y-4 sm:space-y-6">
                <DashboardHeader />
                <DailyProgress />
                <FoodLog />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4 sm:mt-6">
            <WeeklyStats />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 mt-8 sm:mt-12">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            NutriTrack - Track your nutrition journey
          </p>
        </div>
      </footer>
    </div>
  )
}

export function NutritionTracker() {
  return (
    <NutritionProvider>
      <TrackerContent />
    </NutritionProvider>
  )
}
