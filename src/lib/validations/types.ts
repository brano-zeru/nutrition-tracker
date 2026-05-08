import z from 'zod';

export interface RouteSchemas<TBody, TQuery, TParams> {
    body?: z.Schema<TBody>;
    query?: z.Schema<TQuery>;
    params?: z.Schema<TParams>;
}

export interface RouteOptions<TBody, TQuery, TParams> {
    schemas: RouteSchemas<TBody, TQuery, TParams>;
    authRequired?: boolean;
}
