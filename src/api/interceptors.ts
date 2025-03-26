import { useUserStore } from '@/stores';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { request } from './axios';

let isRefreshPending = false;

const errorMessages = ['Unauthorized', 'Access Token expired'];

const onRefreshToken = async () => {
  const store = useUserStore.getState();
  const refreshToken = store?.refreshToken;

  if (refreshToken) {
    try {
      const accessToken = '';
      const newRefreshToken = '';
      // const {
      //   data: { accessToken, refreshToken: newRefreshToken },
      // } = await refreshTokenRequest(refreshToken);

      store?.setAccessToken(accessToken);
      store?.setRefreshToken(newRefreshToken);

      return accessToken;
    } catch (e) {
      // TODO: handle error
    }
  }

  return null;
};

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = useUserStore.getState().accessToken;

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  const originalRequest = error.config!;
  const data = error?.response?.data as any;
  const meta = data?.meta;
  const statusCode = error?.response?.status;

  if (statusCode === 401 && errorMessages?.includes(meta?.message) && !isRefreshPending) {
    try {
      isRefreshPending = true;
      const token = await onRefreshToken();

      if (token) {
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        return request(originalRequest);
      }
    } catch (error) {
      // TODO: handle error
    } finally {
      isRefreshPending = false;
    }
  }

  return Promise.reject(meta || data || error);
};
