import { validatedRoute } from '@/lib/validations';
import { foodLogsDeleteRequestSchema } from '@/lib/validations/schemas';
import { FoodLogsService } from '@/services/foodLogs.service';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = validatedRoute(
    { schemas: foodLogsDeleteRequestSchema },
    async (_request: NextRequest, { params }) => {
        const { foodLogID } = params;

        await FoodLogsService.deleteFoodLogEntry(foodLogID);

        return NextResponse.json(
            { message: 'Food log entry deleted successfully' },
            { status: 200 },
        );
    },
);
