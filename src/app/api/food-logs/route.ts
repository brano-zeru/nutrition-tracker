import { TIME_ZONE_HEADER } from '@/consts';
import { validatedRoute } from '@/lib/validations';
import {
    foodLogsPostRequest,
    getFoodLogByDateSchema,
} from '@/lib/validations/schemas';
import { FoodLogsService } from '@/services/foodLogs.service';
import { FoodEntryDTO } from '@/types/dto';
import { NextRequest, NextResponse } from 'next/server';

export const POST = validatedRoute(
    { schemas: foodLogsPostRequest },
    async (_request: NextRequest, { body, userId }) => {
        const addedEntry = await FoodLogsService.addFoodLogEntry(
            body as FoodEntryDTO,
            userId,
        );
        return NextResponse.json(addedEntry, { status: 201 });
    },
);

export const GET = validatedRoute(
    {
        schemas: getFoodLogByDateSchema,
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
