import { post } from '@/helpers/axios'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutResponse,
} from '@/types/auth'
import { AUTH_URLS } from '@/constants/urls'

export const login = (dataLogin: LoginRequest) =>
  post<LoginResponse>(AUTH_URLS.URL_LOGIN, dataLogin)

export const register = (dataRegister: RegisterRequest) =>
  post<RegisterResponse>(AUTH_URLS.URL_REGISTER, dataRegister)

export const logout = () => post<LogoutResponse>(AUTH_URLS.URL_LOGOUT, {})
