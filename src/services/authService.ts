import { post } from '@/helpers/axios'
import type { LoginRequest, LoginResponse, LogoutResponse } from '@/types/auth'
import { AUTH_URLS } from '@/constants/urls'

export const login = (dataLogin: LoginRequest) =>
  post<LoginResponse>(AUTH_URLS.URL_LOGIN, dataLogin)

export const logout = () => post<LogoutResponse>(AUTH_URLS.URL_LOGOUT, {})
