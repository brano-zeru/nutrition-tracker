'use client';

import * as z from 'zod';
import { GenericForm } from './GenericForm';

export const profileSchema = z.object({
    age: z.coerce.number().min(13, 'מינימום גיל 13'),
    height: z.coerce.number().min(100, 'גובה לא תקין'),
    weight: z.coerce.number().min(30, 'משקל לא תקין'),
    targetWeight: z.coerce.number().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileDetailsStepProps {
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isSubmitting: boolean;
}

export function ProfileDetailsStep({
    onSubmit,
    isSubmitting,
}: ProfileDetailsStepProps) {
    const fields: any[] = [
        { name: 'age', label: 'Age', type: 'number', placeholder: '25' },
        {
            name: 'height',
            label: 'Height (cm)',
            type: 'number',
            placeholder: '175',
        },
        {
            name: 'weight',
            label: 'Weight (kg)',
            type: 'number',
            placeholder: '75',
        },
        {
            name: 'targetWeight',
            label: 'Target Weight',
            type: 'number',
            placeholder: '70',
        },
    ];

    return (
        <GenericForm
            isSubmittingLabel="Updating your details..."
            title="Tell us about yourself"
            description="We need these details to calculate your daily goals."
            schema={profileSchema}
            fields={fields}
            onSubmit={onSubmit}
            submitLabel={isSubmitting ? 'Saving...' : 'Finish & Start'}
        />
    );
}
