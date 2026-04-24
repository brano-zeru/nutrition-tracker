import {
    foodLogBaseSchema,
    goalsSchema,
    registerSchema,
    userBaseSchema,
    userProfileSchema,
} from '@/lib/validations/schemas';
import { z } from 'zod';

export type UserDTO = z.infer<typeof userBaseSchema> & { id: string };
export type FoodEntryDTO = z.infer<typeof foodLogBaseSchema>;
export type ProfileDTO = z.infer<typeof userProfileSchema>;

export interface UserDetails {
    user: UserDTO;
    profile: ProfileDTO;
}

export type RegisterUserDTO = z.infer<typeof registerSchema>;

export type UserGoals = z.infer<typeof goalsSchema>;
