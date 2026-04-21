import { prisma } from '@/lib/prisma';
import { FoodEntryDTO, UserDTO } from '@/types/dto';
import { fromZonedTime } from 'date-fns-tz';
import { FoodLog as FoodEntry } from '@prisma/client';

export class FoodLogsService {
    static async addFoodLogEntry(
        entry: FoodEntryDTO,
        userId: UserDTO['id'],
    ): Promise<FoodEntryDTO> {
        const newEntry = await prisma.foodLog.create({
            data: {
                calories: entry.calories,
                protein: entry.protein,
                notes: entry.notes,
                name: entry.name,
                userId,
            },
            select: {
                calories: true,
                protein: true,
                notes: true,
                name: true,
            },
        });

        return newEntry;
    }

    static async getFoodLogsByDate(
        date: string,
        userId: UserDTO['id'],
        timeZone: string,
    ): Promise<FoodEntry[]> {
        const startUtc = fromZonedTime(`${date}T00:00:00.000`, timeZone);

        const endUtc = new Date(startUtc);
        endUtc.setUTCDate(endUtc.getUTCDate() + 1);

        const foodLogs = await prisma.foodLog.findMany({
            where: {
                userId,
                timestamp: {
                    gte: startUtc,
                    lt: endUtc,
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
            select: {
                id: true,
                name: true,
                calories: true,
                protein: true,
                notes: true,
                timestamp: true,
                updatedAt: true,
                userId: true,
            },
        });

        return foodLogs;
    }

    static async deleteFoodLogEntry(id: string): Promise<void> {
        await prisma.foodLog.delete({
            where: {
                id,
            },
        });
    }
}
