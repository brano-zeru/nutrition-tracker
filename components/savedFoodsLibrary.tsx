'use client'

import { useState } from 'react'
import { useNutrition } from '@/lib/nutritionContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Plus, BookOpen, Trash2, ChevronRight } from 'lucide-react'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { SavedFood } from '@/lib/types'

export function SavedFoodsLibrary() {
  const { savedFoods, addSavedFood, removeSavedFood, addSavedFoodToDay } = useNutrition()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<SavedFood | null>(null)
  const [grams, setGrams] = useState('100')
  const [newFood, setNewFood] = useState({
    name: '',
    caloriesPer100g: '',
    proteinPer100g: '',
  })
  
  const filteredFoods = savedFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddNewFood = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFood.name || !newFood.caloriesPer100g) return
    
    addSavedFood({
      name: newFood.name,
      caloriesPer100g: parseInt(newFood.caloriesPer100g) || 0,
      proteinPer100g: parseFloat(newFood.proteinPer100g) || 0,
    })
    
    setNewFood({ name: '', caloriesPer100g: '', proteinPer100g: '' })
    setIsAddOpen(false)
  }
  
  const handleQuickAdd = (food: SavedFood) => {
    setSelectedFood(food)
    setGrams('100')
  }
  
  const confirmQuickAdd = () => {
    if (selectedFood && grams) {
      addSavedFoodToDay(selectedFood, parseInt(grams))
      setSelectedFood(null)
    }
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-1.5 sm:gap-2 border-border/50 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4">
          <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Food Library</span>
          <span className="sm:hidden">Library</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-card border-border p-0">
        <SheetHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Saved Foods Library
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods..."
                className="pl-10 bg-input border-border text-sm"
              />
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="bg-primary text-primary-foreground shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-[calc(100%-2rem)] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Food</DialogTitle>
                  <DialogDescription>Save a new food to your library for quick access.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddNewFood}>
                  <FieldGroup className="gap-3 sm:gap-4">
                    <Field>
                      <FieldLabel>Food Name</FieldLabel>
                      <Input
                        value={newFood.name}
                        onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Cottage Cheese"
                        className="bg-input border-border"
                        required
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Field>
                        <FieldLabel>Calories / 100g</FieldLabel>
                        <Input
                          type="number"
                          value={newFood.caloriesPer100g}
                          onChange={(e) => setNewFood(prev => ({ ...prev, caloriesPer100g: e.target.value }))}
                          placeholder="0"
                          className="bg-input border-border"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Protein / 100g</FieldLabel>
                        <Input
                          type="number"
                          step="0.1"
                          value={newFood.proteinPer100g}
                          onChange={(e) => setNewFood(prev => ({ ...prev, proteinPer100g: e.target.value }))}
                          placeholder="0"
                          className="bg-input border-border"
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                  <DialogFooter className="mt-4 sm:mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      Save Food
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] px-4 sm:px-6">
          <div className="space-y-2 pb-6">
            {filteredFoods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No foods found</p>
              </div>
            ) : (
              filteredFoods.map((food) => (
                <Card
                  key={food.id}
                  className="border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => handleQuickAdd(food)}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{food.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <span className="text-calories">{food.caloriesPer100g} cal</span>
                        {' / '}
                        <span className="text-protein">{food.proteinPer100g}g</span>
                        <span className="text-muted-foreground"> per 100g</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSavedFood(food.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Quick Add Dialog */}
        <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
          <DialogContent className="bg-card border-border max-w-[calc(100%-2rem)] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Add {selectedFood?.name}</DialogTitle>
              <DialogDescription>Specify the amount in grams to add to today&apos;s log.</DialogDescription>
            </DialogHeader>
            <FieldGroup className="gap-3 sm:gap-4">
              <Field>
                <FieldLabel>Amount (grams)</FieldLabel>
                <Input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  placeholder="100"
                  className="bg-input border-border"
                />
              </Field>
              {selectedFood && grams && (
                <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">This will add:</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-calories font-medium">
                      {Math.round((selectedFood.caloriesPer100g * parseInt(grams || '0')) / 100)} cal
                    </span>
                    <span className="text-protein font-medium">
                      {Math.round((selectedFood.proteinPer100g * parseInt(grams || '0')) / 100 * 10) / 10}g protein
                    </span>
                  </div>
                </div>
              )}
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={confirmQuickAdd} className="bg-primary text-primary-foreground">
                Add to Today
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  )
}
