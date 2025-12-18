import HttpClientException from '@/lib/exceptions/HttpClientException';
import IHttpClient, { CacheConfig } from '@/lib/httpClient/IHttpClient';

class FetchClient implements IHttpClient {
  public get<R>(
    url: string,
    params?: Record<string, string>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeFetchRequest(
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
    return this.makeFetchRequest<D, R>(
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
    params?: Record<string, string | boolean | number>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeFetchRequest<D, R>(
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
    params?: Record<string, string | boolean | number>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    return this.makeFetchRequest<D, R>(
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
    return this.makeFetchRequest<D, R>(
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

  private async makeFetchRequest<D, R>(
    url: string,
    method: string,
    body: D | null,
    params?: Record<string, string | boolean | number>,
    passedHeaders?: Record<string, string>,
    cacheConfig?: CacheConfig,
  ): Promise<R> {
    let headers = {
      'Content-Type': 'application/json',
    };
    if (passedHeaders) {
      headers = { ...headers, ...passedHeaders };
    }

    const urlWithParams = this.addParamsToUrl(url, params);

    const requestDetails: RequestInit = {
      method,
      headers,
    };
    if (cacheConfig) {
      if (cacheConfig.revalidateSec) {
        requestDetails.next = { revalidate: cacheConfig.revalidateSec };
      }
      if (cacheConfig.tags) {
        requestDetails.next = { tags: cacheConfig.tags };
      }
    }

    if (body) {
      requestDetails.body = JSON.stringify(body);
    }
    // console.log('URL', url);
    return new Promise((resolve,reject) => {fetch(urlWithParams, requestDetails)
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
         } else {
          response.json()
             .catch((err) => {
               reject(new HttpClientException(
                 `Error from fetch for url ${method} ${url}`,
                 response.status,
                 response.json(),
               ))
             })
             .then((json) => {
                // the status was ok and the body could be parsed
                // console.log('JSON', json);
               reject(new HttpClientException(
                 `Error from fetch for url ${method} ${url}`,
                 response.status,
                 json,
               ))
             });
         }
       })
       .catch((error: unknown) => {
      //   // console.log('error from fetch', error);

        if (error instanceof HttpClientException) {
          reject(error);
        }
        reject(new HttpClientException(
          `Error from fetch for url ${method} ${url}`,
          null,
          (error as Error).message,
        ))
      })
  })
  }
}

export default FetchClient;