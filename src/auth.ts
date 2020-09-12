import axios from 'axios'
import { API, USER } from './constants'

export class Authentication {
  async auth() {
    const payload = {
      agent: {
        name: 'Minecraft',
        version: 1,
      },
      username: USER.USERNAME,
      password: USER.PASSWORD,
      requestUser: true,
    }
    try {
      const res = await axios.post(API.AUTH + '/authenticate', payload)
      const data = res.data
      return {
        accessToken: data.accessToken,
        uuid: data.selectedProfile.id,
      }
    } catch (e) {
      console.error('Auth Error', e)
      return {
        accessToken: '',
        uuid: '',
      }
    }
  }
}
