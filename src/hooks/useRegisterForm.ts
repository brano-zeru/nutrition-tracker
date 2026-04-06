'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/fetchApi';
import { accumulateData, getRoute } from '@/utils';
import { Pages } from '@/consts';
import { RegisterUserDTO } from '@/types';
import { StepScope } from '@/app/register/register.config';

type FormStepData = Record<string, string | number | undefined>;

export const useRegisterForm = (totalSteps: number) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [registrationData, setRegistrationData] = useState<
        Partial<RegisterUserDTO>
    >({});
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleStepSubmit = async (
        formData: FormStepData,
        scope: StepScope,
    ) => {
        setError(null);

        const updatedData = accumulateData<RegisterUserDTO, StepScope>(
            registrationData,
            formData,
            scope,
        );

        setRegistrationData(updatedData);

        const isLastStep = stepIndex === totalSteps - 1;

        if (isLastStep) {
            setIsSubmitting(true);
            try {
                if (updatedData.user) {
                    updatedData.user.role = 'USER';
                }

                await fetchApi(
                    '/api/auth/register',
                    'POST',
                    updatedData as RegisterUserDTO,
                );

                router.push(getRoute(Pages.HOME));
            } catch (error: unknown) {
                setError(
                    (error as Error)?.message || 'Invalid Registration Error',
                );
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setStepIndex((prev) => prev + 1);
        }
    };

    return {
        stepIndex,
        error,
        isSubmitting,
        handleStepSubmit,
        registrationData,
    };
};
