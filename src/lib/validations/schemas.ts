import z from 'zod';

const userRoleSchema = z.enum(['USER', 'ADMIN']);

export const userBaseSchema = z.object({
    email: z.string().email(),
    role: userRoleSchema.optional(),
    fullName: z.string(),
});

export const profileActivityLevel = z.enum([
    'SEDENTARY',
    'LIGHTLY_ACTIVE',
    'MODERATELY_ACTIVE',
    'VERY_ACTIVE',
    'EXTRA_ACTIVE',
]);

export const goalsSchema = z.object({
    targetWeight: z.coerce.number().min(30, 'Invalid weight'),
    calorieGoal: z.coerce.number().min(500, 'Invalid calories amount'),
    proteinGoal: z.coerce.number().min(100, 'Invalid protein amount'),
});

export const profileBaseSchema = goalsSchema.extend({
    age: z.coerce.number().min(13, 'user should be atleast 13'),
    height: z.coerce.number().min(100, 'invalid height'),
    weight: z.coerce.number().min(30, 'invalid weight'),
    activityLevel: profileActivityLevel,
});

export const foodLogBaseSchema = z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    notes: z.string().nullable(),
});

export const registerAccountSchema = userBaseSchema.extend({
    password: z.string(),
});

export const registerProfileSchema = profileBaseSchema;

export const registerGoalsSchema = goalsSchema;

export const registerSchema = z.object({
    user: registerAccountSchema,
    profile: registerProfileSchema,
});

export const checkEmailRequestSchema = {
    query: z.object({
        email: z.string().email(),
    }),
};

export const loginRequestSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
};

export const logoutRequestSchema = {};

export const meRequestSchema = {};

export const registerRequestSchema = {
    body: registerSchema,
};

export const foodLogsDeleteRequestSchema = {
    params: z.object({
        id: z.string(),
    }),
};

export const foodLogsPostRequest = {
    body: foodLogBaseSchema,
};

export const getFoodLogByDateRequestSchema = {
    query: z.object({
        date: z.string(),
    }),
};
