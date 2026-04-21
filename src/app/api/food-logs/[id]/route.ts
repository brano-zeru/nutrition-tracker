import { FoodLogsService } from '@/services/foodLogs.service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
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
            {
                message: 'Failed to delete food log entry',
                error: (error as Error).message,
            },
            { status: 500 },
        );
    }
}
