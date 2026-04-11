import { fetchApi } from '@/services/fetchApi';
import { ProfileDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const { profile } = await fetchApi<{ profile: ProfileDTO }>(
                'api/user/profile',
                'GET',
            );

            return profile;
        },

        staleTime: 10 * 60 * 1000,
    });
};
