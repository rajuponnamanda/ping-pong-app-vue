import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { PublicClientApplication } from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    clientId: 'f2da1455-cac6-42a4-8f3d-813891144c2c',
    authority: 'https://login.microsoftonline.com/8f6bd982-92c3-4de0-985d-0e287c55e379',
    redirectUri: window.location.origin,
    postLogoutUri: window.location.origin
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
}
export const graphScopes = {
  scopes: ['openid', 'profile', 'email', 'User.Read', 'User.ReadBasic.All']
}
const graphRequest = {
  scopes: ['https://graph.microsoft.com/User.Read'],
  endpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value'
}

import type { SilentRequest } from '@azure/msal-browser'

export const request: SilentRequest = {
  scopes: ['api://f2da1455-cac6-42a4-8f3d-813891144c2c/User.Read']
}

export const myMSALObj = new PublicClientApplication(msalConfig)

const axiosInstance = axios.create({
  baseURL: 'https://tabletennis-web-dev.azurewebsites.net/api'
})

const requestInterceptor = axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig<any>> => {
    const accessToken = await myMSALObj.acquireTokenSilent(request)
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken.accessToken}`
    } else {
      config.headers = { Authorization: `Bearer ${accessToken.accessToken}` }
    }
    return config as InternalAxiosRequestConfig<any>
  },
  (error) => Promise.reject(error)
)

// Clear the interceptor if needed
// axiosInstance.interceptors.request.eject(requestInterceptor);

export default axiosInstance
