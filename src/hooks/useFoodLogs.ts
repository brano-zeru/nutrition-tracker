import { useNutrition } from '@/contexts/nutritionContext';
import { getDateString } from '@/contexts/nutritionStore';
import { fetchApi } from '@/services/fetchApi';
import { FoodEntry } from '@/types';
import {
    QueryObserverResult,
    RefetchOptions,
    useMutation,
    useQuery,
} from '@tanstack/react-query';

interface useFoodLogsValue {
    currentDayFoodLogEntries: FoodEntry[] | undefined;
    saveFoodLogEntry: (
        entry: Omit<FoodEntry, 'id' | 'timestamp'>,
    ) => Promise<FoodEntry>;
    refechFoodLogEntries: (
        options?: RefetchOptions | undefined,
    ) => Promise<QueryObserverResult<FoodEntry[], Error>>;
    isFetchingFoodLogs: boolean;
    deleteFoodLogEntry: (id: string) => Promise<void>;
}

export const useFoodLogs = (): useFoodLogsValue => {
    const { selectedDate } = useNutrition();

    const foodLogsGetter = useQuery({
        queryKey: ['foodLog', getDateString(selectedDate)],
        queryFn: async (): Promise<FoodEntry[]> => {
            return await fetchApi(
                `/api/food-logs?date=${getDateString(selectedDate)}`,
                'GET',
            );
        },
    });

    const foodLogsSetter = useMutation({
        mutationKey: ['foodLog'],
        mutationFn: async (
            entry: Omit<FoodEntry, 'id' | 'timestamp'>,
        ): Promise<FoodEntry> =>
            await fetchApi('/api/food-logs', 'POST', entry),
    });

    const foodLogRemover = useMutation({
        mutationKey: ['foodLog'],
        mutationFn: async (id: string): Promise<void> =>
            await fetchApi(`/api/food-logs/${id}`, 'DELETE'),
    });

    return {
        currentDayFoodLogEntries: foodLogsGetter.data,
        saveFoodLogEntry: foodLogsSetter.mutateAsync,
        refechFoodLogEntries: foodLogsGetter.refetch,
        isFetchingFoodLogs: foodLogsGetter.isFetching,
        deleteFoodLogEntry: foodLogRemover.mutateAsync,
    };
};
