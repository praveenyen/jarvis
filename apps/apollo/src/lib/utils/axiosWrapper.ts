import 'server-only';

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { cookies } from 'next/headers';

const USE_BASIC_AUTH = process.env.USE_BASIC_AUTH;
const BASIC_TOKEN = process.env.BASIC_AUTH?.split(' ')[1];

//TODO: cannot use getheaders here because of the use of async, we can avoid using next cookies api and use cookies from request headers
const getHeaders = async (customHeaders: Record<string, string>) => {
  const cookieStore = await cookies();
  const idToken = cookieStore
    .getAll()
    .find((item) => item.name.split('.').includes('idToken'))?.value;
  // console.log('all cookies', idToken);

  return {
    headers: {
      ...customHeaders,
      'Content-Type': 'application/json',
      Authorization: idToken ? `Bearer ${idToken}` : '',
    },
  };
};

const createApiWrapper = (baseUrl: string) => {
  /**
   * API wrapper function
   * @param method - HTTP method (GET, POST, etc.)
   * @param endpoint - API endpoint to call
   * @param config - Additional Axios request configuration
   * @param headers - Additional headers
   * @returns A promise resolving to the API response or rejecting with an error
   */

  const apiRequest = async <T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    config?: AxiosRequestConfig,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse> => {
    try {
      const cookieStore = await cookies();

      const idToken = cookieStore
        .getAll()
        .find((item) => item.name.split('.').includes('idToken'))?.value;

      let token = USE_BASIC_AUTH ? `Basic ${BASIC_TOKEN}` : `Bearer ${idToken}`;

      // console.log('Making request with Axios:');
      // console.log('Method:', method);
      // console.log('URL:', `${baseUrl}${endpoint}`);

      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Authorization: token,
        },
        ...config,
      });
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Request failed:', error.message);

        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error in setting up request:', error.message);
        }

        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
  };

  return apiRequest;
};

export default createApiWrapper;
