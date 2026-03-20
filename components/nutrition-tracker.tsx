'use client'

import { useState } from 'react'
import { NutritionProvider, useNutrition } from '@/lib/nutrition-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardHeader } from '@/components/dashboard-header'
import { DailyProgress } from '@/components/daily-progress'
import { MagicAIEntry } from '@/components/magic-ai-entry'
import { FoodLog } from '@/components/food-log'
import { SavedFoodsLibrary } from '@/components/saved-foods-library'
import { HistoryLog } from '@/components/history-log'
import { WeeklyStats } from '@/components/weekly-stats'
import { GoalsSettings } from '@/components/goals-settings'
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
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Apple className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">NutriTrack</h1>
                <p className="text-xs text-muted-foreground">Your nutrition companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SavedFoodsLibrary />
              <GoalsSettings />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border/50 p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Apple className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Magic AI Entry */}
            <MagicAIEntry onParsedEntry={handleAIParsedEntry} />
            
            {/* Date Navigation */}
            <DashboardHeader />
            
            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Progress & Food Log */}
              <div className="lg:col-span-2 space-y-6">
                <DailyProgress />
                <FoodLog />
              </div>
              
              {/* History Sidebar */}
              <div className="lg:col-span-1">
                <HistoryLog />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <HistoryLog />
              <div className="space-y-6">
                <DashboardHeader />
                <DailyProgress />
                <FoodLog />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <WeeklyStats />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            NutriTrack · Track your nutrition journey
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
