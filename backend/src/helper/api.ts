import type { HttpStatusCode } from 'axios';
import type { Request, Response } from 'express';
import type { OpResponseTypes } from 'openapi-typescript-fetch/types';

import type { paths as backendPaths } from '@/generated/backend';

export type RequireParams = <T extends readonly string[]>(params: T) => (req: Request, res: Response) => false | Record<T[number], string>;

export const requirePathParams: RequireParams = (params) => (req, res) => {
    const foundParamsWithTheirValues = [];

    for (const param of params) {
        if (!req.params[param]) {
            res.status(400).send(`Missing parameter from path: ${param}`);
            return false;
        }

        foundParamsWithTheirValues.push([param, req.params[param]]);
    }

    return Object.fromEntries(foundParamsWithTheirValues) as Record<typeof params[number], string>;
};

export const requireQueryParams: RequireParams = (params) => (req, res) => {
    const foundParamsWithTheirValues = [];

    for (const param of params) {
        if (!req.query[param]) {
            res.status(400).send(`Missing parameter from query: ${param}`);
            return false;
        }

        foundParamsWithTheirValues.push([param, req.query[param]]);
    }

    return Object.fromEntries(foundParamsWithTheirValues) as Record<typeof params[number], string>;
};

export const requireBodyParams: RequireParams = (params) => (req, res) => {
    const foundParamsWithTheirValues = [];

    for (const param of params) {
        if (!req.body[param]) {
            res.status(400).send(`Missing parameter from body: ${param}`);
            return false;
        }

        foundParamsWithTheirValues.push([param, req.body[param]]);
    }

    return Object.fromEntries(foundParamsWithTheirValues) as Record<typeof params[number], string>;
};

export type GetOrPost<T> = T extends { get: unknown } ? T['get'] : T extends { post: unknown } ? T['post'] : never;

export type GetKeyIfExists<T, K, R = never> = K extends keyof T ? T[K] : R;

type Foo<T extends keyof backendPaths> = OpResponseTypes<GetOrPost<backendPaths[T]>>[200];

export type ApiResponseType<T extends keyof backendPaths> = GetKeyIfExists<Foo<T>, 'data', Foo<T> extends { success: unknown } ? undefined : never>;

/*
export const successResponse = <T extends keyof backendPaths = never>(res: Response, data: ApiResponseType<T>): void => {
    res.status(200).json({ success: true, data });
};
*/

// rewrite successResponse so that data is optional in case ApiResponseType<T> is undefined
// type SuccessResponse<T extends keyof backendPaths> = ApiResponseType<T> extends undefined ? { success: true } : { success: true; data: ApiResponseType<T> };

// type of the function (() => T)
export type SuccessResponse<T extends keyof backendPaths> = ApiResponseType<T> extends undefined ? [res: Response] : [res: Response, data: ApiResponseType<T>];

export const successResponse = <T extends keyof backendPaths = never>(...args: SuccessResponse<T>): void => {
    const [res, data] = args;

    if (process.env.NODE_ENV === 'development') {
        console.log('successResponse', data);
    }

    res.status(200).json({ success: true, data });
};

export const errorResponse = (res: Response, code: HttpStatusCode, message?: string, debugInfo?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
        console.error('errorResponse', code, message, debugInfo);
    }

    res.status(code).json({ success: false, message: message ?? 'Internal server error' });
};
