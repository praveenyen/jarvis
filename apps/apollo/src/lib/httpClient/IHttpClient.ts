export type CacheConfig = {
  revalidateSec?: number;
  tags?: string[];
};
export default interface IHttpClient {
  get<R>(
    url: string,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R>;

  post<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R>;

  put<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R>;

  patch<D, R>(
    url: string,
    data: D,
    params?: Record<string, string | boolean | number>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R>;

  delete<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R>;
}
