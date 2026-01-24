import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { deleteCookie, getCookie, setCookie } from "../cookies";
import { Mutex } from "async-mutex";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getCookie("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

function getUrlFromArgs(args: string | FetchArgs) {
  if (typeof args === "string") {
    return args;
  }
  return args.url;
}

/**
 * Auth endpoints for which we DO NOT want global reauth/redirect behaviour.
 * Add any other endpoints you consider "auth-specific" (e.g. /auth/login, /auth/logout).
 */
const AUTH_ENDPOINTS = ["/auth/login", "/auth/refresh", "/auth/logout"];

const handleLogout = async (api: BaseQueryApi) => {
  // Try to call backend logout endpoint to invalidate session
  try {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
    }
  } catch (error) {
    // Silently fail - we still want to clear local state even if backend logout fails
    console.error("Backend logout failed:", error);
  }

  // Clear local state regardless of backend logout result
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  api.dispatch(logout());
  if (typeof window !== "undefined") {
    window.location.href = "/sign-in";
  }
};

const persistTokens = (data: {
  accessToken: string;
  refreshToken?: string;
}) => {
  setCookie("accessToken", data.accessToken, 1);
  if (data.refreshToken) {
    setCookie("refreshToken", data.refreshToken, 7);
  }
};

const attemptTokenRefresh = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  const state = api.getState() as RootState;
  const userId = state.auth.user?._id;
  const refreshToken = getCookie("refreshToken");

  if (!userId || !refreshToken) {
    await handleLogout(api);
    return null;
  }

  const refreshResult = await baseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken, userId },
    },
    api,
    extraOptions
  );

  if (!refreshResult.data) {
    await handleLogout(api);
    return null;
  }

  const data = refreshResult.data as {
    accessToken: string;
    refreshToken?: string;
  };
  persistTokens(data);
  return baseQuery(args, api, extraOptions);
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  const originalUrl = getUrlFromArgs(args) ?? "";
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status !== 401) {
    return result;
  }

  const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => originalUrl.includes(ep));

  if (isAuthEndpoint) {
    return result;
  }

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      const refreshedResult = await attemptTokenRefresh(
        args,
        api,
        extraOptions
      );
      if (refreshedResult) {
        result = refreshedResult;
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      await handleLogout(api);
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
