import { useMemo } from 'react';
import debounce from 'lodash.debounce';
import { GenericForm } from '@/components/GenericForm';
import { ProgressBar } from './ProgressBar';
import { STEPS } from './register.config';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { fetchApi } from '@/services/fetchApi';

export const RegisterForm = () => {
    const {
        stepIndex,
        handleStepSubmit,
        setExternalError,
        fieldErrors,
        setIsValidating,
        isValidating,
    } = useRegisterForm(STEPS.length);

    const currentStep = STEPS[stepIndex];

    const checkEmailUniqueness = useMemo(
        () =>
            debounce(async (email: string) => {
                if (!email || !email.includes('@')) {
                    setIsValidating(false);
                    return;
                }

                setIsValidating(true);
                try {
                    const { exists } = await fetchApi<{ exists: boolean }>(
                        `/api/auth/check-email?email=${encodeURIComponent(email)}`,
                        'GET',
                    );

                    if (exists) {
                        setExternalError('email', 'Email already in use');
                    } else {
                        setExternalError('email', null);
                    }
                } catch (err) {
                    console.error('Failed to check email uniqueness:', err);
                    setExternalError('email', null);
                } finally {
                    setIsValidating(false);
                }
            }, 600),
        [setExternalError, setIsValidating],
    );

    return (
        <>
            <ProgressBar steps={STEPS} stepIndex={stepIndex} />
            <GenericForm
                key={currentStep.id}
                {...currentStep}
                externalErrors={fieldErrors}
                isExternalLoading={isValidating}
                onFieldChange={(name, value) => {
                    if (name === 'email') {
                        setIsValidating(true);
                        checkEmailUniqueness(value as string);
                    }
                }}
                onSubmit={(data) => handleStepSubmit(data, currentStep.scope)}
            />
        </>
    );
};
