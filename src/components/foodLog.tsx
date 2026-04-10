'use client';

import { useState } from 'react';
import { useNutrition } from '@/contexts/nutritionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, UtensilsCrossed, Copy } from 'lucide-react';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { FoodEntry } from '@/types/types';

export function FoodLog() {
    const { getCurrentDayLog, addFoodEntry, removeFoodEntry } = useNutrition();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [duplicateEntry, setDuplicateEntry] = useState<FoodEntry | null>(
        null,
    );
    const [duplicateMultiplier, setDuplicateMultiplier] = useState('1');
    const [newEntry, setNewEntry] = useState({
        name: '',
        calories: '',
        protein: '',
        notes: '',
    });

    const currentLog = getCurrentDayLog();
    const entries = currentLog.entries;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.name || !newEntry.calories) return;

        addFoodEntry({
            name: newEntry.name,
            calories: parseInt(newEntry.calories) || 0,
            protein: parseFloat(newEntry.protein) || 0,
            notes: newEntry.notes,
        });

        setNewEntry({ name: '', calories: '', protein: '', notes: '' });
        setIsAddOpen(false);
    };

    const handleDuplicate = (entry: FoodEntry) => {
        setDuplicateEntry(entry);
        setDuplicateMultiplier('1');
    };

    const confirmDuplicate = () => {
        if (duplicateEntry) {
            const multiplier = parseFloat(duplicateMultiplier) || 1;
            addFoodEntry({
                name: duplicateEntry.name,
                calories: Math.round(duplicateEntry.calories * multiplier),
                protein:
                    Math.round(duplicateEntry.protein * multiplier * 10) / 10,
                notes:
                    multiplier !== 1
                        ? `${multiplier}x portion`
                        : duplicateEntry.notes,
            });
            setDuplicateEntry(null);
        }
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Card className="border-border/50 bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-medium">
                    Food Log
                </CardTitle>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm h-8 sm:h-9"
                        >
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Add Entry</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-[calc(100%-2rem)] sm:max-w-lg mx-auto">
                        <DialogHeader>
                            <DialogTitle>Add Food Entry</DialogTitle>
                            <DialogDescription>
                                Log a new food item with calories and protein.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup className="gap-3 sm:gap-4">
                                <Field>
                                    <FieldLabel>Food Name</FieldLabel>
                                    <Input
                                        value={newEntry.name}
                                        onChange={(e) =>
                                            setNewEntry((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g., Grilled Chicken"
                                        className="bg-input border-border"
                                        required
                                    />
                                </Field>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <Field>
                                        <FieldLabel>Calories</FieldLabel>
                                        <Input
                                            type="number"
                                            value={newEntry.calories}
                                            onChange={(e) =>
                                                setNewEntry((prev) => ({
                                                    ...prev,
                                                    calories: e.target.value,
                                                }))
                                            }
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
                                            onChange={(e) =>
                                                setNewEntry((prev) => ({
                                                    ...prev,
                                                    protein: e.target.value,
                                                }))
                                            }
                                            placeholder="0"
                                            className="bg-input border-border"
                                        />
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel>Notes (optional)</FieldLabel>
                                    <Textarea
                                        value={newEntry.notes}
                                        onChange={(e) =>
                                            setNewEntry((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        placeholder="Any additional notes..."
                                        className="bg-input border-border resize-none"
                                        rows={2}
                                    />
                                </Field>
                            </FieldGroup>
                            <DialogFooter className="mt-4 sm:mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground"
                                >
                                    Add Entry
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                        <div className="rounded-full bg-secondary p-3 sm:p-4 mb-3 sm:mb-4">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            No food entries yet
                        </p>
                        <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                            Add your first meal to start tracking
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile View - Card Layout */}
                        <div className="sm:hidden space-y-2">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="bg-secondary/30 rounded-lg p-3 border border-border/30"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate">
                                                {entry.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {formatTime(entry.timestamp)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDuplicate(entry)
                                                }
                                                className="h-7 w-7 text-muted-foreground hover:text-primary"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeFoodEntry(entry.id)
                                                }
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-calories font-mono">
                                            {entry.calories} cal
                                        </span>
                                        <span className="text-protein font-mono">
                                            {entry.protein}g protein
                                        </span>
                                    </div>
                                    {entry.notes && (
                                        <p className="text-[10px] text-muted-foreground mt-1.5">
                                            {entry.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Layout */}
                        <div className="hidden sm:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="text-muted-foreground">
                                            Time
                                        </TableHead>
                                        <TableHead className="text-muted-foreground">
                                            Food
                                        </TableHead>
                                        <TableHead className="text-muted-foreground text-right">
                                            Calories
                                        </TableHead>
                                        <TableHead className="text-muted-foreground text-right">
                                            Protein
                                        </TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((entry) => (
                                        <TableRow
                                            key={entry.id}
                                            className="border-border/50 hover:bg-secondary/30"
                                        >
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatTime(entry.timestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {entry.name}
                                                    </p>
                                                    {entry.notes && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {entry.notes}
                                                        </p>
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
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDuplicate(
                                                                entry,
                                                            )
                                                        }
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        title="Add again"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeFoodEntry(
                                                                entry.id,
                                                            )
                                                        }
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </CardContent>

            {/* Duplicate Entry Dialog */}
            <Dialog
                open={!!duplicateEntry}
                onOpenChange={() => setDuplicateEntry(null)}
            >
                <DialogContent className="bg-card border-border max-w-[calc(100%-2rem)] sm:max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Add Again: {duplicateEntry?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Add this food again with an optional portion
                            multiplier.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="gap-4">
                        <Field>
                            <FieldLabel>Portion Multiplier</FieldLabel>
                            <Input
                                type="number"
                                step="0.5"
                                min="0.5"
                                value={duplicateMultiplier}
                                onChange={(e) =>
                                    setDuplicateMultiplier(e.target.value)
                                }
                                placeholder="1"
                                className="bg-input border-border"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Use 1 for same amount, 2 for double, 0.5 for
                                half, etc.
                            </p>
                        </Field>
                        {duplicateEntry && duplicateMultiplier && (
                            <div className="bg-secondary/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    This will add:
                                </p>
                                <div className="flex justify-between">
                                    <span className="text-calories font-medium">
                                        {Math.round(
                                            duplicateEntry.calories *
                                                (parseFloat(
                                                    duplicateMultiplier,
                                                ) || 1),
                                        )}{' '}
                                        cal
                                    </span>
                                    <span className="text-protein font-medium">
                                        {Math.round(
                                            duplicateEntry.protein *
                                                (parseFloat(
                                                    duplicateMultiplier,
                                                ) || 1) *
                                                10,
                                        ) / 10}
                                        g protein
                                    </span>
                                </div>
                            </div>
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={confirmDuplicate}
                            className="bg-primary text-primary-foreground"
                        >
                            Add Entry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
