import { useState, useEffect } from 'react';
import { Scale, TrendingDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';

const WeightDialog = ({
    currentWeight,
    onUpdate,
}: {
    currentWeight: number;
    onUpdate: (val: number) => void;
}) => {
    const [value, setValue] = useState<string | number>(currentWeight || '');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setValue(currentWeight || '');
        }
    }, [isOpen, currentWeight]);

    const handleSubmit = () => {
        if (value !== '') {
            onUpdate(Number(value));
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    className="h-10 w-10 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 rounded-full transition-all duration-300 text-zinc-400 border border-white/5"
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-white/10 text-white p-8">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                        Update Weight
                    </DialogTitle>
                    <p className="text-zinc-500 text-sm text-center">
                        Tracking your weight consistently helps in accurate
                        macro calculations.
                    </p>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                        Current Weight (kg)
                    </label>
                    <div className="relative w-full max-w-[180px]">
                        <Input
                            type="number"
                            step="0.1"
                            value={value ?? ''}
                            onChange={(e) => setValue(e.target.value)}
                            className="bg-transparent border-none text-center text-5xl font-black h-16 focus-visible:ring-0 text-emerald-500 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            autoFocus
                        />
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mt-1" />
                    </div>
                </div>

                <DialogFooter className="sm:flex-col gap-3">
                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 text-lg shadow-lg shadow-emerald-900/20"
                    >
                        Save Weight
                    </Button>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-zinc-500 hover:text-white"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const WeightMiniCard = () => {
    const { goals, profile, isLoading } = useProfile();
    const weight = profile?.weight || 0;
    const [currentWeight, setCurrentWeight] = useState(weight || 0);

    useEffect(() => {
        if (weight !== undefined) {
            setCurrentWeight(weight);
        }
    }, [weight]);

    const handleWeightUpdate = (newWeight: number) => {
        setCurrentWeight(newWeight);
    };

    //should be replaced with a skeleton loader
    if (isLoading || !goals) return <></>;

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all duration-500">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/10">
                    <Scale className="w-5 h-5 text-emerald-500" />
                </div>

                <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                        Current Weight
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white leading-none">
                            {currentWeight}
                        </span>
                        <span className="text-xs font-medium text-zinc-500 uppercase">
                            kg
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10 border-x border-white/5 px-10">
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                        Target
                    </p>
                    <p className="text-sm font-bold text-zinc-300 italic">
                        {goals.targetWeight || 0}kg
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
                        Trend
                    </p>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>{0}kg</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <WeightDialog
                    currentWeight={currentWeight}
                    onUpdate={handleWeightUpdate}
                />
            </div>
        </div>
    );
};
