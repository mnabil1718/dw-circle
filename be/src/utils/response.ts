type ResponseStatus = "success" | "error";

export type APIResponse<T> = |
{
    code: number;
    status: ResponseStatus;
    message: string;
    data?: T;
} | {
    code: number;
    status: ResponseStatus;
    message: string;
    errors?: Record<string, string>;
}

export const success = <T>(code: number, message: string, data?: T): APIResponse<T> => ({
    code,
    status: "success",
    message,
    data,
});

export const fail = (code: number, message: string, errors?: Record<string, string>): APIResponse<never> => ({
    code,
    status: "error",
    message,
    errors,
});

