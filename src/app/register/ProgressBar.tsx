import { FormStep } from './register.config';

interface ProgressBarProps {
    steps: FormStep[];
    stepIndex: number;
}

export const ProgressBar = ({ steps, stepIndex }: ProgressBarProps) => {
    return (
        <div className="flex justify-center gap-3 mb-8 w-full">
            {steps.map((_, index) => (
                <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        index <= stepIndex ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                />
            ))}
        </div>
    );
};
