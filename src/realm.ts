import { AxiosResponse, AxiosStatic } from 'axios'
import { API } from './constants'
import fs from 'fs';

type PlayerInfo = { [key: string]: Promise<any> }
export class Realm {
  constructor(private readonly httpClient: AxiosStatic) { }

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
    let players: string[] = []
    const cacheString = fs.readFileSync('src/cache/uuid.json').toString()
    const cache = JSON.parse(cacheString);
    if (server) {
      const playerList = JSON.parse(server.playerList)
      const playerInfoList: PlayerInfo[] = playerList.map((player: any) => {
        if (cache[player.playerId] !== undefined) {
          return { [player.playerId]: cache[player.playerId] }
        }
        const api = `/user/profiles/${player.playerId}/names`
        return {
          [player.playerId]: this.httpClient.get(API.MOJANG + api)
        }
      })
      for await (const playerInfo of playerInfoList) {
        const promise = Object.values(playerInfo)[0];
        const res = await promise;
        const playerID = Object.keys(playerInfo)[0]
        const playerName = res.data ? res.data[res.data.length - 1].name : res
        if (cache[playerID] === undefined) {
          cache[playerID] = playerName;
        }
        players.push(playerName)
      }
    }
    await fs.writeFileSync('src/cache/uuid.json', JSON.stringify(cache))
    return players || []
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
