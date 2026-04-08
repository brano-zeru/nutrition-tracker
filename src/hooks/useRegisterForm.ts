'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/services/fetchApi';
import { accumulateData, getRoute } from '@/utils';
import { Pages } from '@/consts';
import { RegisterUserDTO, UserDetails, UserDTO } from '@/types';
import { StepScope } from '@/app/register/register.config';
import { useAuth } from '@/contexts/AuthContext';

type FormStepData = Record<string, string | number | undefined>;

export const useRegisterForm = (totalSteps: number) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [registrationData, setRegistrationData] = useState<
        Partial<RegisterUserDTO>
    >({});
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const { setUser } = useAuth();

    const handleStepSubmit = async (
        formData: FormStepData,
        scope: StepScope,
    ) => {
        setError(null);

        const userData = accumulateData<RegisterUserDTO, StepScope>(
            registrationData,
            formData,
            scope,
        );

        setRegistrationData(userData);

        const isLastStep = stepIndex === totalSteps - 1;

        if (isLastStep) {
            setIsSubmitting(true);
            try {
                if (userData.user) {
                    userData.user.role = 'USER';
                }

                const { user } = await fetchApi<{
                    message: string;
                    user: UserDTO;
                }>('/api/auth/register', 'POST', userData as RegisterUserDTO);

                setUser(user);

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
