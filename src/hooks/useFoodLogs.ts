import { useNutrition } from '@/contexts/nutritionContext';
import { getDateString } from '@/contexts/nutritionStore';
import { fetchApi } from '@/services/fetchApi';
import { FoodEntry, FoodEntryDTO } from '@/types/dto';
import {
    QueryObserverResult,
    RefetchOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

interface useFoodLogsValue {
    currentDayFoodLogEntries: FoodEntry[] | undefined;
    saveFoodLogEntry: (entry: FoodEntryDTO) => Promise<FoodEntry>;
    refechFoodLogEntries: (
        options?: RefetchOptions | undefined,
    ) => Promise<QueryObserverResult<FoodEntry[], Error>>;
    isFetchingFoodLogs: boolean;
    deleteFoodLogEntry: (id: string) => Promise<void>;
}

export const useFoodLogs = (): useFoodLogsValue => {
    const { selectedDate } = useNutrition();
    const queryClient = useQueryClient();

    const foodLogsGetter = useQuery({
        queryKey: ['foodLog', getDateString(selectedDate)],
        queryFn: async (): Promise<FoodEntry[]> => {
            return await fetchApi(
                `/api/food-logs?date=${getDateString(selectedDate)}`,
            );
        },
    });

    const foodLogsSetter = useMutation({
        mutationKey: ['foodLogSetter'],
        mutationFn: async (entry: FoodEntryDTO): Promise<FoodEntry> =>
            await fetchApi('/api/food-logs', 'POST', entry),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['foodLog', getDateString(selectedDate)],
            }),
    });

    const foodLogRemover = useMutation({
        mutationKey: ['foodLogRemover'],
        mutationFn: async (id: string): Promise<void> =>
            await fetchApi(`/api/food-logs/${id}`, 'DELETE'),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['foodLog', getDateString(selectedDate)],
            }),
    });

    return {
        currentDayFoodLogEntries: foodLogsGetter.data,
        saveFoodLogEntry: foodLogsSetter.mutateAsync,
        refechFoodLogEntries: foodLogsGetter.refetch,
        isFetchingFoodLogs: foodLogsGetter.isFetching,
        deleteFoodLogEntry: foodLogRemover.mutateAsync,
    };
};
