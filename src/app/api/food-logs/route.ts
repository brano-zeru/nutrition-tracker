import { TIME_ZONE_HEADER } from '@/consts';
import { validatedRoute } from '@/lib/validations';
import {
    foodLogsPostRequest,
    getFoodLogByDateRequestSchema,
} from '@/lib/validations/schemas';
import { FoodLogsService } from '@/services/foodLogs.service';
import { NextRequest, NextResponse } from 'next/server';

export const POST = validatedRoute(
    {
        schemas: foodLogsPostRequest,
        authRequired: true,
    },
    async (_request: NextRequest, { body, userId }) => {
        const addedEntry = await FoodLogsService.addFoodLogEntry(body, userId);
        return NextResponse.json(addedEntry, { status: 201 });
    },
);

export const GET = validatedRoute(
    {
        schemas: getFoodLogByDateRequestSchema,
        authRequired: true,
    },
    async (request: NextRequest, { query, userId }) => {
        const { date } = query; // Expecting YYYY-MM-DD format
        const timeZone = request.headers.get(TIME_ZONE_HEADER);

        if (!timeZone) {
            return NextResponse.json(
                { error: 'Time zone is required! timezone = ' + timeZone },
                { status: 400 },
            );
        }

        const foodLogs = await FoodLogsService.getFoodLogsByDate(
            date,
            userId,
            timeZone,
        );

        return NextResponse.json(foodLogs, { status: 200 });
    },
);
