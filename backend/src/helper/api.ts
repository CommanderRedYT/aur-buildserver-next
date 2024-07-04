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

export interface ResponseOptions {
    canCache?: boolean;
}

export const defaultResponseOptions: ResponseOptions = {
    canCache: true,
};

export type GetOrPost<T> = T extends { get: unknown } ? T['get'] : T extends { post: unknown } ? T['post'] : never;

export type GetKeyIfExists<T, K, R = never> = K extends keyof T ? T[K] : R;

export type GetSuccessResponse<T extends keyof backendPaths> = OpResponseTypes<GetOrPost<backendPaths[T]>>[200];

export type ApiResponseType<T extends keyof backendPaths> = GetKeyIfExists<GetSuccessResponse<T>, 'data', GetSuccessResponse<T> extends { success: unknown } ? undefined : never>;

export type SuccessResponse<T extends keyof backendPaths> = ApiResponseType<T> extends undefined ? [res: Response, data?: never, options?: ResponseOptions] : [res: Response, data: ApiResponseType<T>, options?: ResponseOptions];

export const successResponse = <T extends keyof backendPaths = never>(...args: SuccessResponse<T>): void => {
    const [res, dataOrOptions, maybeOptions] = args;

    const actualData = dataOrOptions as ApiResponseType<T>;
    const actualOptions = {
        ...defaultResponseOptions,
        ...(maybeOptions as ResponseOptions),
    };

    if (process.env.NODE_ENV === 'development') {
        console.log('successResponse', actualData, actualOptions);
    }

    if (!actualOptions?.canCache) {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    res.status(200).json({ success: true, data: actualData });
};

export const errorResponse = (res: Response, code: HttpStatusCode, message?: string, options?: ResponseOptions, debugInfo?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
        console.error('errorResponse', code, message, debugInfo);
    }

    res.status(code).json({ success: false, message: message ?? 'Internal server error' });
};
