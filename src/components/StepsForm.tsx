'use client';

import { ProgressBar } from '@/app/register/ProgressBar';
import { FormStep } from '@/app/register/register.config';
import { GenericForm } from '@/components/GenericForm';
import { FieldValues } from 'react-hook-form';

interface StepsFormProps<T extends FieldValues> {
    steps: FormStep[];
    currentStepIndex: number;
    onStepSubmit: (data: T, scope: any) => void;
    externalErrors?: Record<string, string>;
    isLoading?: boolean;
    onFieldChange?: (name: string, value: any) => void;
}

export function StepsForm<T extends FieldValues>({
    steps,
    currentStepIndex,
    onStepSubmit,
    externalErrors,
    isLoading,
    onFieldChange,
}: StepsFormProps<T>) {
    const currentStep = steps[currentStepIndex];

    return (
        <div className="flex flex-col gap-8 w-full max-w-md">
            <ProgressBar steps={steps} stepIndex={currentStepIndex} />

            <GenericForm
                key={currentStep.id}
                {...currentStep}
                externalErrors={externalErrors}
                isExternalLoading={isLoading}
                onFieldChange={onFieldChange}
                onSubmit={async (data) =>
                    await onStepSubmit(data as T, currentStep.scope)
                }
                isSubmittingLabel="Processing..."
            />
        </div>
    );
}
