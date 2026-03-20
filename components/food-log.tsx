'use client'

import { useState } from 'react'
import { useNutrition } from '@/lib/nutrition-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

export function FoodLog() {
  const { getCurrentDayLog, addFoodEntry, removeFoodEntry } = useNutrition()
  const [isOpen, setIsOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    name: '',
    calories: '',
    protein: '',
    notes: '',
  })
  
  const currentLog = getCurrentDayLog()
  const entries = currentLog.entries
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntry.name || !newEntry.calories) return
    
    addFoodEntry({
      name: newEntry.name,
      calories: parseInt(newEntry.calories) || 0,
      protein: parseFloat(newEntry.protein) || 0,
      notes: newEntry.notes,
    })
    
    setNewEntry({ name: '', calories: '', protein: '', notes: '' })
    setIsOpen(false)
  }
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium">Food Log</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel>Food Name</FieldLabel>
                  <Input
                    value={newEntry.name}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Grilled Chicken"
                    className="bg-input border-border"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Calories</FieldLabel>
                    <Input
                      type="number"
                      value={newEntry.calories}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="0"
                      className="bg-input border-border"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Protein (g)</FieldLabel>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.protein}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="0"
                      className="bg-input border-border"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Notes (optional)</FieldLabel>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    className="bg-input border-border resize-none"
                    rows={2}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Add Entry
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-secondary p-4 mb-4">
              <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No food entries yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Add your first meal to start tracking
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Food</TableHead>
                  <TableHead className="text-muted-foreground text-right">Calories</TableHead>
                  <TableHead className="text-muted-foreground text-right">Protein</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="border-border/50 hover:bg-secondary/30">
                    <TableCell className="text-muted-foreground text-sm">
                      {formatTime(entry.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground">{entry.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-calories">
                      {entry.calories}
                    </TableCell>
                    <TableCell className="text-right font-mono text-protein">
                      {entry.protein}g
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFoodEntry(entry.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
