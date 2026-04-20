'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSteps } from '@/hooks/useSteps';
import { fetchApi } from '@/services/fetchApi';
import { StepScope } from '@/app/register/register.config';
import { useAuth } from '@/contexts/AuthContext';
import { Pages } from '@/consts';
import { getRoute, accumulateData } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { RegisterUserDTO, UserDTO } from '@/types/dto';

export const useRegisterForm = (totalSteps: number) => {
    const router = useRouter();
    const { setUser } = useAuth();

    const {
        stepIndex,
        formData: registrationData,
        fieldErrors,
        nextStep,
        updateData,
        setExternalError,
    } = useSteps<RegisterUserDTO>(totalSteps);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailToCheck, setEmailToCheck] = useState('');

    const { data: emailStatus } = useQuery({
        queryKey: ['checkEmail', emailToCheck],
        queryFn: () =>
            fetchApi<{ exists: boolean }>(
                `/api/auth/check-email?email=${encodeURIComponent(emailToCheck)}`,
            ),
        enabled: emailToCheck.includes('@'),
    });

    useEffect(() => {
        const isCurrentlyInUse = emailStatus?.exists;
        const hasErrorAlready = fieldErrors['email'];

        if (isCurrentlyInUse && !hasErrorAlready) {
            setExternalError('email', 'Email already in use');
        } else if (!isCurrentlyInUse && hasErrorAlready) {
            setExternalError('email', null);
        }
    }, [emailStatus?.exists, setExternalError, fieldErrors]);

    const handleStepSubmit = async (data: any, scope: StepScope) => {
        if (Object.keys(fieldErrors).length > 0) return;

        const updatedFullData = accumulateData<RegisterUserDTO, StepScope>(
            registrationData,
            data,
            scope,
        );
        updateData(updatedFullData);

        const isLastStep = stepIndex === totalSteps - 1;

        if (isLastStep) {
            setIsSubmitting(true);
            try {
                const finalData = { ...updatedFullData };
                if (finalData.user) finalData.user.role = 'USER';

                const { user } = await fetchApi<{ user: UserDTO }>(
                    '/api/auth/register',
                    'POST',
                    finalData,
                );

                setUser(user);
                router.push(getRoute(Pages.HOME));
            } catch (err) {
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            nextStep();
        }
    };

    return {
        stepIndex,
        fieldErrors,
        isSubmitting,
        handleStepSubmit,
        setEmailToCheck,
        emailToCheck,
        registrationData,
    };
};
