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
});

export const goalsSchema = z.object({
    targetWeight: z.coerce
        .number()
        .min(30, 'invalid weight')
        .max(200, 'invalid weight'),
    targetProteins: z.coerce
        .number()
        .min(40, 'invalid proteins amount')
        .max(500, 'invalid proteins amount'),
    targetCalories: z.coerce
        .number()
        .min(400, 'invalid calories amount')
        .max(5000, 'invalid calories amount'),
});

export type StepScope = 'user' | 'profile';

type BaseField = {
    name: string;
    label: string;
    type: string;
    options?: { label: string; value: string }[];
};

type StaticPlaceholderField = BaseField & {
    placeholder: string;
    dynamicPlaceholder?: never;
};

type DynamicPlaceholderField = BaseField & {
    dynamicPlaceholder: (val: string) => string;
    placeholder?: never;
};

type FormField = StaticPlaceholderField | DynamicPlaceholderField;

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
        submitLabel: 'Next: Your Goals',
        isSubmittingLabel: 'Saving...',
        schema: profileSchema,
        fields: [
            {
                name: 'age',
                label: 'Age',
                type: 'number',
                placeholder: '25',
            },
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
                name: 'activityLevel',
                label: 'Activity Level',
                type: 'select',
                placeholder: 'Select activity level',
                options: [
                    { label: 'Sedentary (Office job)', value: 'SEDENTARY' },
                    {
                        label: 'Lightly Active (1-2 workouts/week)',
                        value: 'LIGHTLY_ACTIVE',
                    },
                    {
                        label: 'Moderately Active (3-5 workouts/week)',
                        value: 'MODERATELY_ACTIVE',
                    },
                    {
                        label: 'Very Active (Daily workouts)',
                        value: 'VERY_ACTIVE',
                    },
                    {
                        label: 'Extra Active (Professional athlete)',
                        value: 'EXTRA_ACTIVE',
                    },
                ],
            },
        ],
    },
    {
        id: 'goals',
        scope: 'profile',
        title: 'Define your goals (optional)',
        description: 'Last step: goals',
        submitLabel: 'Finish & Start',
        isSubmittingLabel: 'Creating account...',
        schema: goalsSchema,
        fields: [
            {
                name: 'targetWeight',
                label: 'Target Weight (kg)',
                type: 'number',
                dynamicPlaceholder: (weight: string) =>
                    `${weight} (recommended for you)`,
            },
            {
                name: 'targetCalories',
                label: 'Target Calories (per day)',
                type: 'number',
                dynamicPlaceholder: (calories: string) =>
                    `${calories} (recommended for you)`,
            },
            {
                name: 'targetProteins',
                label: 'Target Proteins (per day)',
                type: 'number',
                dynamicPlaceholder: (proteins: string) =>
                    `${proteins} (recommended for you)`,
            },
        ],
    },
];
