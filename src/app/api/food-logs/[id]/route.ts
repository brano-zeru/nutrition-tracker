import { FoodLogsService } from '@/services/foodLogs.service';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { id: string } },
) => {
    console.log(params);

    const { id } = await params;

    try {
        if (!id) {
            return NextResponse.json(
                { error: 'Food log entry ID is required' },
                { status: 400 },
            );
        }

        await FoodLogsService.deleteFoodLogEntry(id);

        return NextResponse.json(
            { message: 'Food log entry deleted successfully' },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error deleting food log entry:', error);
        return NextResponse.json(
            { error: 'Failed to delete food log entry' },
            { status: 500 },
        );
    }
};
