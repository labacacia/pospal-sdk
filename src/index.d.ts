export type PospalVersion = 'v1' | 'v2';
export interface PospalResponse<T = unknown> { status: 'success' | 'error' | string; messages?: string[]; errorCode?: number; data?: T; }
export interface PospalClientOptions {
  appId: string; appKey: string; version?: PospalVersion; baseUrl?: string; areaId?: string;
  timeout?: number; throwOnApiError?: boolean; fetch?: typeof globalThis.fetch;
}
export interface RequestOptions { timestamp?: number | string; timeout?: number; headers?: Record<string, string>; }
export class PospalApiError extends Error { response: PospalResponse; errorCode?: number; statusCode?: number; endpoint?: string; requestId?: string | null; }
export class PospalHttpError extends Error { statusCode?: number; endpoint?: string; body?: unknown; }
export class PospalClient {
  constructor(options: PospalClientOptions);
  readonly appId: string; readonly version: PospalVersion; readonly baseUrl: string;
  request<T = unknown>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<PospalResponse<T>>;
  /** Named API wrappers accept the request body documented by PosPal and resolve to its response. */
  [method: string]: any;
}
export { PospalClient as Pospal };
