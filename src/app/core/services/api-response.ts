export interface ApiResponse<T> {
  succeeded: boolean;
  message: string | null;
  errorCode: number | null;
  data: T | null;
}

export interface ApiError {
  message: string | null;
  validation: string | null;
}