'use client';

import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { useQuery } from '@tanstack/react-query';
import { STEPS } from './register.config';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { fetchApi } from '@/services/fetchApi';
import { StepsForm } from '@/components/StepsForm';

export const RegisterForm = () => {
    const { stepIndex, handleStepSubmit, fieldErrors, setEmailToCheck } =
        useRegisterForm(STEPS.length);

    // סטייטים לסנכרון הקלדה (מניעת שיבושים)
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
        />
    );
};
