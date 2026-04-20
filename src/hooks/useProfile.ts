import { fetchApi } from '@/services/fetchApi';
import { ProfileDTO, UserGoals } from '@/types/dto';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useProfile = () => {
    const queryClient = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { profile } = await fetchApi<{ profile: ProfileDTO }>(
                'api/user/profile',
            );
            return profile;
        },
        staleTime: 10 * 60 * 1000,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData: Partial<ProfileDTO>) => {
            return await fetchApi<{ profile: ProfileDTO }>(
                'api/user/profile',
                'PATCH',
                { profile: updatedData },
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
    });

    const goals = useMemo<UserGoals | null>(() => {
        if (!profileQuery.data) return null;

        return {
            calorieGoal: profileQuery.data.calorieGoal ?? 0,
            proteinGoal: profileQuery.data.proteinGoal ?? 0,
            targetWeight: profileQuery.data.targetWeight ?? 0,
        };
    }, [profileQuery.data]);

    return {
        profile: profileQuery.data,
        goals,
        isLoading: profileQuery.isLoading,
        isUpdating: updateProfileMutation.isPending,
        updateProfile: updateProfileMutation.mutateAsync,
    };
};
