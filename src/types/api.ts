export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export type ApiErrorResponse =
    | { error: string }
    | { message: string }
    | { message: { message: string; code?: number } }
    | { errors: Record<string, string[]> };

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}