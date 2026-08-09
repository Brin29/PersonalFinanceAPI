import { ERROR_CODES, ErrorCode } from "./responseCodes";

export interface AppErrorOptions {
  message?: string;
  statusCode?: number;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    const definition = ERROR_CODES[code];
    super(options.message ?? definition.message);
    this.name = definition.code;
    this.code = definition.code;
    this.status = options.statusCode ?? definition.status;
  }
}

export const throwError = (code: ErrorCode, options?: AppErrorOptions): never => {
  throw new AppError(code, options);
};
