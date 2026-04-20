'use client';

import { useCallback, useState } from 'react';

export function useSteps<TData extends Record<string, any>>(
    totalSteps: number,
) {
    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState<Partial<TData>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const nextStep = useCallback(() => {
        if (stepIndex < totalSteps - 1) {
            setStepIndex((prev) => prev + 1);
        }
    }, [setStepIndex]);

    const prevStep = useCallback(() => {
        if (stepIndex > 0) {
            setStepIndex((prev) => prev - 1);
        }
    }, [setStepIndex]);

    const updateData = useCallback(
        (newData: Partial<TData>) => {
            setFormData((prev) => ({ ...prev, ...newData }));
        },
        [setFormData],
    );

    const setExternalError = useCallback(
        (name: string, message: string | null) => {
            setFieldErrors((prev) => {
                if (!message) {
                    const { [name]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [name]: message };
            });
        },
        [],
    );

    return {
        stepIndex,
        formData,
        fieldErrors,
        nextStep,
        prevStep,
        updateData,
        setExternalError,
        setFieldErrors,
    };
}
