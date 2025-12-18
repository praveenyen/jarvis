import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  CreateAxiosDefaults,
} from 'axios';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';

class AxiosClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(config: CreateAxiosDefaults) {
    this.client = axios.create(config);
  }

  public get<R>(
    url: string,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    // console.log('INSIDE GET');
    return this.makeAxiosRequests<null, R>(
      url,
      'GET',
      null,
      params,
      passedHeaders,
      cacheConfig,
    );
  }

  public post<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeAxiosRequests<D, R>(
      url,
      'POST',
      data,
      params,
      passedHeaders,
      cacheConfig,
    );
  }

  public put<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeAxiosRequests<D, R>(
      url,
      'PUT',
      data,
      params,
      passedHeaders,
      cacheConfig,
    );
  }

  public patch<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeAxiosRequests<D, R>(
      url,
      'PATCH',
      data,
      params,
      passedHeaders,
      cacheConfig,
    );
  }

  public delete<D, R>(
    url: string,
    data: D,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeAxiosRequests<D, R>(
      url,
      'DELETE',
      data,
      params,
      passedHeaders,
      cacheConfig,
    );
  }

  private addParamsToUrl(
    url: string,
    params?: Record<string, string | boolean | number>,
  ): string {
    if (params) {
      const urlObj = new URL(url);

      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.append(key, value.toString());
      });
      return urlObj.toString();
    } else {
      return url;
    }
  }

  private async makeAxiosRequests<D, R>(
    url: string,
    method: string,
    body: D | null,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    /* urgent todo*/

    let headers = {
      'Content-Type': 'application/json',
    };

    if (passedHeaders) {
      headers = { ...headers, ...passedHeaders };
    }
    // console.log('url', url);
    const urlWithParams = this.addParamsToUrl(url, params);
    // console.log('url with params', url);
    return new Promise((resolve, reject) => {
      this.client
        .request<R, AxiosResponse<R>, D>({
          url: urlWithParams,
          method: method.toUpperCase(),
          ...(body && { data: body }),
          headers: headers,
        })
        .then((response) => {
          // console.log('MADE request');
          resolve(response.data); // Return the response.data;
        })
        .catch((error: any) => {
          // console.log('axios ERROR', error);
          if (axios.isAxiosError(error)) {
            if (error.response) {
              reject(
                new HttpClientException(
                  error.response.data.message,
                  error.response.status,
                  error.response.data,
                ),
              );
            } else if (error.request) {
              reject(
                new HttpClientException(
                  error.request.response.message,
                  null,
                  error.request,
                ),
              );
            } else {
              reject(
                new HttpClientException(
                  error.message,
                  null,
                  error.message,
                ),
              );
            }
          }
          reject(
            new HttpClientException(
              (error as Error).message,
              null,
              (error as Error).message,
            ),
          );
        });
    });
  }
}

export default AxiosClient;
