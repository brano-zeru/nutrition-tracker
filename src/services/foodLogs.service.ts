import { prisma } from '@/lib/prisma';
import { FoodEntry, FoodEntryDTO, UserDTO } from '@/types/dto';
import { fromZonedTime } from 'date-fns-tz';

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
                foodName: entry.name,
                userId,
            },
            select: {
                calories: true,
                protein: true,
                notes: true,
                foodName: true,
            },
        });

        return { ...newEntry, name: newEntry.foodName };
    }

    static async getFoodLogsByDate(
        date: string,
        userId: UserDTO['id'],
        timeZone: string,
    ): Promise<FoodEntry[]> {
        const startUtc = fromZonedTime(`${date}T00:00:00.000`, timeZone);

        const endUtc = new Date(startUtc);
        endUtc.setUTCDate(endUtc.getUTCDate() + 1);

        console.log(timeZone, startUtc, endUtc);

        const foodLogs = await prisma.foodLog.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startUtc,
                    lt: endUtc,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                foodName: true,
                calories: true,
                protein: true,
                notes: true,
                createdAt: true,
            },
        });

        return foodLogs.map((log) => ({
            id: log.id,
            name: log.foodName,
            calories: log.calories,
            protein: log.protein,
            notes: log.notes,
            timestamp: log.createdAt,
        }));
    }

    static async deleteFoodLogEntry(id: string): Promise<void> {
        await prisma.foodLog.delete({
            where: {
                id,
            },
        });
    }
}
