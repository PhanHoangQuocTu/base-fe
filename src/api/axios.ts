import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { appConfig } from '@/config';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';
import { env } from '@/utils/const';

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: appConfig.apiUrl + env.API_PREFIX,
  responseType: 'json',
};

export const request: AxiosInstance = axios.create(axiosRequestConfig);

request.interceptors.request.use(requestInterceptor);
request.interceptors.response.use(successInterceptor, errorInterceptor);
