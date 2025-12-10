import Http, { handleApiError } from '@/helpers/https'
import type { AxiosRequestConfig } from 'axios'
import queryString from 'query-string'

export async function get<T = any>(
  url: string,
  queryParams?: Record<string, any> | undefined,
  config?: AxiosRequestConfig,
) {
  try {
    if (queryParams) {
      const query = queryString.stringify(queryParams)
      url = url.indexOf('?') == -1 ? `${url}?${query}` : `${url}&${query}`
    }
    const res = await Http.get<T>(url, config)
    return res?.data
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function post<T = any, D = any>(url: string, data: D, config?: AxiosRequestConfig) {
  try {
    const res = await Http.post<T>(url, data, config)
    return res?.data
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function put<T = any, D = any>(url: string, data: D, config?: AxiosRequestConfig) {
  try {
    const res = await Http.put<T>(url, data, config)
    return res?.data
  } catch (error: any) {
    return handleApiError(error)
  }
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig) {
  try {
    const res = await Http.delete<T>(url, config)
    return res?.data
  } catch (error: any) {
    return handleApiError(error)
  }
}
