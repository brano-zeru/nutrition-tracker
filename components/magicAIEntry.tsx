'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface MagicAIEntryProps {
  onParsedEntry?: (entries: { name: string; calories: number; protein: number }[]) => void
}

export function MagicAIEntry({ onParsedEntry }: MagicAIEntryProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setIsProcessing(true)
    
    // Simulate AI processing - in a real app, this would call an AI API
    setTimeout(() => {
      // Simple mock parsing for demonstration
      const mockEntries = parseMockInput(input)
      onParsedEntry?.(mockEntries)
      setInput('')
      setIsProcessing(false)
    }, 1000)
  }
  
  // Simple mock parser for demo purposes
  const parseMockInput = (text: string) => {
    const entries: { name: string; calories: number; protein: number }[] = []
    const lowerText = text.toLowerCase()
    
    // Simple pattern matching for common foods
    const foodPatterns = [
      { pattern: /(\d+)?\s*eggs?/i, name: 'Eggs', calPer: 78, protPer: 6 },
      { pattern: /chicken/i, name: 'Chicken Breast', calPer: 165, protPer: 31 },
      { pattern: /tuna/i, name: 'Tuna', calPer: 116, protPer: 26 },
      { pattern: /salmon/i, name: 'Salmon', calPer: 208, protPer: 20 },
      { pattern: /rice/i, name: 'Rice', calPer: 130, protPer: 3 },
      { pattern: /banana/i, name: 'Banana', calPer: 105, protPer: 1 },
      { pattern: /oatmeal|oats/i, name: 'Oatmeal', calPer: 150, protPer: 5 },
      { pattern: /yogurt/i, name: 'Greek Yogurt', calPer: 100, protPer: 10 },
      { pattern: /protein shake/i, name: 'Protein Shake', calPer: 150, protPer: 25 },
      { pattern: /toast/i, name: 'Toast', calPer: 75, protPer: 2 },
    ]
    
    for (const { pattern, name, calPer, protPer } of foodPatterns) {
      const match = lowerText.match(pattern)
      if (match) {
        const quantity = match[1] ? parseInt(match[1]) : 1
        entries.push({
          name: quantity > 1 ? `${quantity} ${name}` : name,
          calories: calPer * quantity,
          protein: protPer * quantity,
        })
      }
    }
    
    // If no patterns matched, create a generic entry
    if (entries.length === 0) {
      entries.push({
        name: text.trim(),
        calories: 200,
        protein: 10,
      })
    }
    
    return entries
  }
  
  return (
    <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={'Try "2 eggs and tuna"...'}
              className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/50 text-sm"
              disabled={isProcessing}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Quick Add</span>
              </>
            )}
          </Button>
        </form>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 ml-1">
          Magic AI Entry - Type natural language to log foods
        </p>
      </CardContent>
    </Card>
  )
}
