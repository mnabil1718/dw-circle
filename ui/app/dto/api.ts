
// success only, because errors are handled by interceptors
export type APIResponse<T> =
    {
      code: number;
      status: "success";
      message: string;
      data?: T;
    };
