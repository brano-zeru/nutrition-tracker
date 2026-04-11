import z from 'zod';

export const accountSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const profileSchema = z.object({
    age: z.coerce.number().min(13, 'Must be at least 13'),
    height: z.coerce.number().min(100, 'Invalid height'),
    weight: z.coerce.number().min(30, 'Invalid weight'),
    targetWeight: z.coerce.number().optional(),
});

export type StepScope = 'user' | 'profile';

interface FormField {
    name: string;
    label: string;
    type: string;
    placeholder: string;
}

export interface FormStep {
    id: string;
    scope: StepScope;
    title: string;
    description: string;
    schema: z.ZodObject<any>;
    submitLabel: string;
    isSubmittingLabel: string;
    fields: FormField[];
}

export const STEPS: FormStep[] = [
    {
        id: 'account',
        scope: 'user',
        title: 'Join Nutrish',
        description: 'Step 1: Create your account',
        submitLabel: 'Next: Personal Details',
        isSubmittingLabel: 'Saving...',
        schema: accountSchema,
        fields: [
            {
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Jhon Doe ...',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'name@example.com',
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: '••••••••',
            },
        ],
    },
    {
        id: 'profile',
        scope: 'profile',
        title: 'Tell us about yourself',
        description: 'Step 2: Nutrition Profile',
        submitLabel: 'Finish & Start',
        isSubmittingLabel: 'Creating account...',
        schema: profileSchema,
        fields: [
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
        ],
    },
];
