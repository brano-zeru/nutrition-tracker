'use client';

import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { useQuery } from '@tanstack/react-query';
import { STEPS } from '../../app/register/register.config';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { fetchApi } from '@/services/fetchApi';
import { StepsForm } from '@/components/forms/StepsForm';
import { calculateRecommendedGoals } from '@/utils';

export const RegisterForm = () => {
    const {
        stepIndex,
        handleStepSubmit,
        fieldErrors,
        setEmailToCheck,
        registrationData,
    } = useRegisterForm(STEPS.length);

    const [emailValue, setEmailValue] = useState('');
    const [debouncedEmail, setDebouncedEmail] = useState('');

    const updateEmailDebounced = useMemo(
        () =>
            debounce((val: string) => {
                setDebouncedEmail(val);
                setEmailToCheck(val);
            }, 600),
        [setEmailToCheck],
    );

    const { isFetching: isServerChecking } = useQuery({
        queryKey: ['checkEmail', debouncedEmail],
        queryFn: () =>
            fetchApi<{ exists: boolean }>(
                `/api/auth/check-email?email=${encodeURIComponent(debouncedEmail)}`,
            ),
        enabled: debouncedEmail.includes('@'),
    });

    const isTyping = emailValue !== debouncedEmail;
    const isAsyncValidating = isServerChecking || isTyping;

    const processFields = (fields: any[]) => {
        return fields.map((field) => {
            if (field.dynamicPlaceholder) {
                const { profile } = registrationData;

                const weight = Number(profile?.weight ?? 0);
                const height = Number(profile?.height ?? 0);
                const age = Number(profile?.age ?? 0);
                const activity = profile?.activityLevel || 'MODERATELY_ACTIVE';

                if (!weight || !height || !age) {
                    return field;
                }

                const recs = calculateRecommendedGoals({
                    weight,
                    height,
                    age,
                    activityLevel: activity,
                });

                let val = '';
                if (field.name === 'targetWeight') val = recs.weight.toString();
                if (field.name === 'calorieGoal')
                    val = recs.calories.toString();
                if (field.name === 'proteinGoal') val = recs.protein.toString();

                return {
                    ...field,
                    placeholder: field.dynamicPlaceholder(val),
                };
            }
            return field;
        });
    };

    const getNutritionProcessor = () => {
        return (fields: any[]) => {
            return processFields(fields);
        };
    };

    return (
        <StepsForm
            steps={STEPS}
            currentStepIndex={stepIndex}
            isLoading={isAsyncValidating}
            externalErrors={fieldErrors}
            onStepSubmit={handleStepSubmit}
            onFieldChange={(name, value) => {
                if (name === 'email') {
                    setEmailValue(value);
                    updateEmailDebounced(value);
                }
            }}
            onProcessFields={getNutritionProcessor()}
        />
    );
};
