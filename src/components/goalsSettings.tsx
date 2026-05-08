'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Settings, Target, Scale, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { UserGoals } from '@/types/dto';

export function GoalsSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const { profile, updateProfile, isUpdating } = useProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<UserGoals>({
        defaultValues: {
            calorieGoal: 0,
            proteinGoal: 0,
            targetWeight: 0,
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                calorieGoal: profile.calorieGoal || 0,
                proteinGoal: profile.proteinGoal || 0,
                targetWeight: profile.targetWeight || 0,
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: UserGoals) => {
        try {
            await updateProfile(data);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to save goals:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-3 sm:gap-4">
                        <Field>
                            <FieldLabel>Daily Calorie Goal</FieldLabel>
                            <Input
                                {...register('calorieGoal', {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                className="bg-input border-border"
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Daily Protein Goal (grams)</FieldLabel>
                            <Input
                                {...register('proteinGoal', {
                                    valueAsNumber: true,
                                })}
                                type="number"
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
                                    {...register('targetWeight', {
                                        valueAsNumber: true,
                                    })}
                                    type="number"
                                    step="0.1"
                                    placeholder="70.0"
                                    className="bg-input border-border"
                                />
                            </Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter className="mt-4 sm:mt-6">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isUpdating || !isDirty}
                            className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 min-w-[100px]"
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Save Goals'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
