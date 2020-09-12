import axios, { AxiosStatic } from 'axios'

export class HttpClient {
  httpClient: AxiosStatic
  constructor(cookie: string) {
    axios.interceptors.request.use((config) => {
      config.headers = { cookie: cookie || '' }
      return config
    })

    this.httpClient = axios
  }
  changeVersion(minecraftVersion: string) {}
}
