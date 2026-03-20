'use client'

import { useNutrition } from '@/lib/nutrition-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getDateString } from '@/lib/nutrition-store'

export function DashboardHeader() {
  const { selectedDate, setSelectedDate } = useNutrition()
  
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }
  
  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }
  
  const goToToday = () => {
    setSelectedDate(new Date())
  }
  
  const isToday = getDateString(selectedDate) === getDateString(new Date())
  
  const formatDate = (date: Date) => {
    if (isToday) return 'Today'
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (getDateString(date) === getDateString(yesterday)) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDay}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-medium">{formatDate(selectedDate)}</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          disabled={isToday}
          className="h-9 w-9 text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {!isToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Go to Today
        </Button>
      )}
    </div>
  )
}
