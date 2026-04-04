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
import { Settings, Target, Scale } from 'lucide-react';

export function GoalsSettings() {
    const { goals, updateGoals } = useNutrition();
    const [isOpen, setIsOpen] = useState(false);

    const [localGoals, setLocalGoals] = useState({
        calorieGoal: goals.calorieGoal.toString(),
        proteinGoal: goals.proteinGoal.toString(),
        weightGoal: goals.weightGoal.toString(),
    });

    const handleOpen = (open: boolean) => {
        if (open) {
            setLocalGoals({
                calorieGoal: goals.calorieGoal.toString(),
                proteinGoal: goals.proteinGoal.toString(),
                weightGoal: (goals.weightGoal || 70).toString(),
            });
        }
        setIsOpen(open);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGoals({
            calorieGoal: parseInt(localGoals.calorieGoal) || 2000,
            proteinGoal: parseInt(localGoals.proteinGoal) || 150,
            weightGoal: parseFloat(localGoals.weightGoal) || 70,
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
                        Set your daily targets and body weight goal.
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
                                className="bg-input border-border"
                            />
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
                                className="bg-input border-border"
                            />
                        </Field>

                        <div className="pt-2 border-t border-white/5">
                            <Field>
                                <FieldLabel className="flex items-center gap-2">
                                    <Scale className="h-3 w-3 text-emerald-500" />
                                    Target Weight (kg)
                                </FieldLabel>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={localGoals.weightGoal}
                                    onChange={(e) =>
                                        setLocalGoals((prev) => ({
                                            ...prev,
                                            weightGoal: e.target.value,
                                        }))
                                    }
                                    placeholder="70.0"
                                    className="bg-input border-border"
                                />
                            </Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter className="mt-4 sm:mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                        >
                            Save Goals
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
