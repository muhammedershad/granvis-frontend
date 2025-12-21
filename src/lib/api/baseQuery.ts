import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { getCookie, setCookie, deleteCookie } from '../cookies';
import { Mutex } from 'async-mutex';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getCookie('accessToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

function getUrlFromArgs(args: string | FetchArgs) {
  if (typeof args === 'string') return args;
  return args.url;
}

/**
 * Auth endpoints for which we DO NOT want global reauth/redirect behaviour.
 * Add any other endpoints you consider "auth-specific" (e.g. /auth/login, /auth/logout).
 */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/logout'];

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // ensure we don't try to refresh while a refresh is in progress
  await mutex.waitForUnlock();

  const originalUrl = getUrlFromArgs(args) ?? '';

  // run the original query
  let result = await baseQuery(args, api, extraOptions);

  // only handle 401 for non-auth endpoints.
  // If the request itself is an auth endpoint (login / refresh), return the result
  // to the caller so they can handle validation errors themselves.
  if (result?.error?.status === 401) {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) =>
      originalUrl.includes(ep)
    );

    if (isAuthEndpoint) {
      // DO NOT attempt refresh / redirect for login/refresh calls.
      // Let the component/mutation that called login handle the 401 response and show error message.
      return result;
    }

    // For other endpoints, attempt refresh (serialized via mutex)
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Try refresh
        const state = api.getState() as RootState;
        const userId = state.auth.user?._id;
        const refreshToken = getCookie('refreshToken');

        if (!userId || !refreshToken) {
          // nothing we can do: force logout
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          api.dispatch(logout());
          if (typeof window !== 'undefined') window.location.href = '/login';
          return result;
        }

        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: {
              refreshToken,
              userId,
            },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };

          // persist new tokens
          setCookie('accessToken', data.accessToken, 1);
          if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 7);

          // retry original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // refresh failed -> force logout
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          api.dispatch(logout());
          if (typeof window !== 'undefined') window.location.href = '/sign-in';
        }
      } catch (err) {
        console.error('Token refresh error:', err);
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        api.dispatch(logout());
        if (typeof window !== 'undefined') window.location.href = '/sign-in';
      } finally {
        release();
      }
    } else {
      // If a refresh is already in progress, wait for it to complete then retry original request
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
