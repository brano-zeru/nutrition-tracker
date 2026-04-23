import { USER_ID_HEADER } from '@/consts';
import { NextRequest, NextResponse } from 'next/server';
import { RouteOptions } from './types';
import { z } from 'zod';

export function validatedRoute<
    TBody = unknown,
    TQuery = unknown,
    TParams = unknown,
>(
    options: RouteOptions<TBody, TQuery, TParams>,
    handler: (
        req: NextRequest,
        context: {
            body: TBody;
            query: TQuery;
            params: TParams;
            userId: string;
        },
    ) => Promise<NextResponse>,
) {
    return async (request: NextRequest, { params }: { params: unknown }) => {
        try {
            const { schemas, authRequired = false } = options;

            const userId = request.headers.get(USER_ID_HEADER);

            if (authRequired && !userId) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 },
                );
            }

            const validatedBody = schemas.body
                ? schemas.body.parse(await request.json())
                : ({} as TBody);

            const validatedQuery = schemas.query
                ? schemas.query.parse(
                      Object.fromEntries(request.nextUrl.searchParams),
                  )
                : ({} as TQuery);

            const validatedParams = schemas.params
                ? schemas.params.parse(params)
                : (params as TParams);

            return await handler(request, {
                body: validatedBody,
                query: validatedQuery,
                params: validatedParams,
                userId: userId!,
            });
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    error: (error as Error).message,
                }));

                return NextResponse.json(
                    { error: 'Zod validations failed', details: errorMessages },
                    { status: 400 },
                );
            }

            const message =
                error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ error: message }, { status: 500 });
        }
    };
}
