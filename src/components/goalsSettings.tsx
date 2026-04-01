'use client';

import { useState } from 'react';
import { useNutrition } from '@/contexts/nutritionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Settings, Target } from 'lucide-react';

export function GoalsSettings() {
    const { goals, updateGoals } = useNutrition();
    const [isOpen, setIsOpen] = useState(false);
    const [localGoals, setLocalGoals] = useState({
        calorieGoal: goals.calorieGoal.toString(),
        proteinGoal: goals.proteinGoal.toString(),
    });

    const handleOpen = (open: boolean) => {
        if (open) {
            setLocalGoals({
                calorieGoal: goals.calorieGoal.toString(),
                proteinGoal: goals.proteinGoal.toString(),
            });
        }
        setIsOpen(open);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGoals({
            calorieGoal: parseInt(localGoals.calorieGoal) || 2000,
            proteinGoal: parseInt(localGoals.proteinGoal) || 150,
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-border/50 h-8 w-8 sm:h-9 sm:w-9"
                >
                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-[calc(100%-2rem)] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        Daily Goals
                    </DialogTitle>
                    <DialogDescription>
                        Set your daily calorie and protein targets.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-3 sm:gap-4">
                        <Field>
                            <FieldLabel>Daily Calorie Goal</FieldLabel>
                            <Input
                                type="number"
                                value={localGoals.calorieGoal}
                                onChange={(e) =>
                                    setLocalGoals((prev) => ({
                                        ...prev,
                                        calorieGoal: e.target.value,
                                    }))
                                }
                                placeholder="2000"
                                className="bg-input border-border"
                            />
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                Recommended: 1600-2400 for women, 2000-3000 for
                                men
                            </p>
                        </Field>
                        <Field>
                            <FieldLabel>Daily Protein Goal (grams)</FieldLabel>
                            <Input
                                type="number"
                                value={localGoals.proteinGoal}
                                onChange={(e) =>
                                    setLocalGoals((prev) => ({
                                        ...prev,
                                        proteinGoal: e.target.value,
                                    }))
                                }
                                placeholder="150"
                                className="bg-input border-border"
                            />
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                Recommended: 0.8-1g per pound of body weight for
                                active individuals
                            </p>
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
                            Save Goals
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
