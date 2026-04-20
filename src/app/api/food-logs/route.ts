import { FoodLogsService } from '@/services/foodLogs.service';
import { FoodEntry } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get('user-id');
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
    } catch {
        return NextResponse.json(
            { error: 'Failed to add food log entry' },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // Expecting YYYY-MM-DD format
        const userId = request.headers.get('user-id');

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const foodLogs = await FoodLogsService.getFoodLogsByDate(date!, userId);

        return NextResponse.json(foodLogs, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch food logs' },
            { status: 500 },
        );
    }
}
