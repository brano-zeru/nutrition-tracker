import z from 'zod';

export const checkEmailSchema = {
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
    body: z.object({
        user: z.object({
            email: z.string().email(),
            role: z.string(),
            fullName: z.string(),
        }),
        profile: z.object({
            age: z.number(),
            height: z.number(),
            weight: z.number(),
            targetWeight: z.number(),
        }),
    }),
};

export const foodLogsDeleteRequestSchema = {
    params: z.object({
        foodLogID: z.string(),
    }),
};

export const foodLogsPostRequest = {
    body: z.object({
        name: z.string(),
        calories: z.number(),
        protein: z.number(),
        notes: z.string(),
    }),
};

export const getFoodLogByDateSchema = {
    query: z.object({
        date: z.string(),
    }),
};
