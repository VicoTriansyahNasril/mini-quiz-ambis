// [DOCS] Tipe Generic untuk response API.
// Membantu TypeScript autocomplete di seluruh pemanggilan API.
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// [DOCS] Tipe Union untuk berbagai kemungkinan format error dari backend.
export type ApiErrorResponse =
    | { error: string }
    | { message: string }
    | { message: { message: string; code?: number } }
    | { errors: Record<string, string[]> };

// [DOCS] Type Guard function untuk mengecek apakah variable adalah object.
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}