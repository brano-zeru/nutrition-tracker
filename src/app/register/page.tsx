'use client';

import { GenericForm } from '@/components/GenericForm';
import { STEPS } from './register.config';
import { FormProgressBar } from './FormProgressBar';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export default function RegisterPage() {
    const { stepIndex, error, handleStepSubmit } = useRegisterForm(
        STEPS.length,
    );
    const currentStep = STEPS[stepIndex];

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center gap-3 mb-8 w-full">
                    {STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                index <= stepIndex
                                    ? 'bg-emerald-500'
                                    : 'bg-zinc-800'
                            }`}
                        />
                    ))}
                </div>

                <FormProgressBar error={error} />

                <GenericForm
                    key={currentStep.id}
                    {...currentStep}
                    onSubmit={(data) =>
                        handleStepSubmit(data, currentStep.scope)
                    }
                />
            </div>
        </main>
    );
}
