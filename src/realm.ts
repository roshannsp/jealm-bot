import { AxiosResponse, AxiosStatic } from 'axios'
import { API } from './constants'

export class Realm {
  constructor(private readonly httpClient: AxiosStatic) {}

  async available() {
    const res = await this.httpClient.get(API.REALM + '/mco/available')
    return res.data
  }

  async worlds() {
    const res = await this.httpClient.get(API.REALM + '/worlds')
    return res.data.servers
  }

  async online(name: string) {
    const worlds = await this.worlds()
    const world = worlds.find((world: any) => world.name === name)
    const serverList = await this.liveplayerlist()
    const server = serverList.find((server: any) => (server.id = world.id))
    let player: string[] = []
    if (server) {
      const playerList = JSON.parse(server.playerList)
      const promises = playerList.map(async (player: any) => {
        const api = `/user/profiles/${player.playerId}/names`
        return this.httpClient.get(API.MOJANG + api)
      })
      const result = await Promise.all(promises)
      result.forEach((r: any) => {
        player.push(r.data[r.data.length - 1].name)
      })
    }
    return player || []
  }

  async version() {
    const result = await this.httpClient.get(
      API.REALM + '/mco/client/compatible'
    )
    return result.data
  }

  async liveplayerlist() {
    const result = await this.httpClient.get(
      API.REALM + '/activities/liveplayerlist'
    )
    return result.data.lists
  }
}
