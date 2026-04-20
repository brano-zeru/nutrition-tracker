import { USER_ID_HEADER } from '@/consts';
import { FoodLogsService } from '@/services/foodLogs.service';
import { FoodEntry } from '@/types/dto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get(USER_ID_HEADER);
        const data = (await request.json()) as Omit<
            FoodEntry,
            'id' | 'timestamp'
        >;

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const addedEntry = await FoodLogsService.addFoodLogEntry(data, userId);

        return NextResponse.json(addedEntry, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to add food log entry',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // Expecting YYYY-MM-DD format
        const userId = request.headers.get(USER_ID_HEADER);

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const foodLogs = await FoodLogsService.getFoodLogsByDate(date!, userId);

        return NextResponse.json(foodLogs, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to fetch food logs',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
