import FetchClient from '@/lib/httpClient/FetchClient';
import AxiosClient from '@/lib/httpClient/AxiosClient';
import IHttpClient from '@/lib/httpClient/IHttpClient';
import { CreateAxiosDefaults } from 'axios';

class HttpClientFactory {
  private fetchClient: IHttpClient;
  private axiosClient: IHttpClient;

  constructor() {
    this.fetchClient = new FetchClient();
    this.axiosClient = new AxiosClient({});
  }

  public getHttpClient(type: 'fetch' | 'axios'): IHttpClient {
    if (type === 'fetch') return this.fetchClient;
    else return this.axiosClient;
  }

  public getNewHttpClientInstance(
    type: 'fetch' | 'axios',
    config: CreateAxiosDefaults | {},
  ): IHttpClient {
    if (type === 'fetch') return new FetchClient();
    else return new AxiosClient(config as CreateAxiosDefaults);
  }
}

export default new HttpClientFactory();
