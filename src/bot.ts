import { MINECRAFT, TOKEN } from './constants'
import Discord from 'discord.io'
import { Authentication } from './auth'
import { Realm } from './realm'
import { HttpClient } from './http-client'

export class Bot {
  bot: Discord.Client
  auth: Authentication
  realm: Realm | undefined
  constructor() {
    this.bot = new Discord.Client({
      token: TOKEN || '',
      autorun: true,
    })
    this.auth = new Authentication()
  }

  init() {
    this.bot.on('ready', async () => {
      console.log('Logged in as %s - %s\n', this.bot.username, this.bot.id)
      const { accessToken, uuid } = await this.auth.auth()
      const cookie = `sid=token:${accessToken}:${uuid};user=${MINECRAFT.USER};version=${MINECRAFT.VERSION}`
      const httpClient = new HttpClient(cookie)
      this.realm = new Realm(httpClient.httpClient)
    })

    this.bot.on('message', async (user, userID, channelID, message, event) => {
      if (message.startsWith('!jealm ')) {
        message = message.split(' ')[1]
        switch (message) {
          case 'ping':
            this.bot.sendMessage({
              to: channelID,
              message: 'pong',
            })
            break
          case 'available':
            const res = await this.realm?.available()
            const responseMessage = `Jealm is ${
              res ? 'available' : 'unavailable'
            }`
            this.bot.sendMessage({
              to: channelID,
              message: responseMessage,
            })
            break
          case 'online':
            const players = (await this.realm?.online('Jealm')) || []
            if (players.length > 0) {
              this.bot.sendMessage({
                to: channelID,
                message: 'Online players: ' + players?.join(', '),
              })
            } else {
              this.bot.sendMessage({
                to: channelID,
                message: 'No Players Online',
              })
            }
            break
          case 'version':
            const isCompatible = await this.realm?.version()
            const compatibleMessage = `This Realm is ${isCompatible} with Minecraft version ${MINECRAFT.VERSION}`
            this.bot.sendMessage({
              to: channelID,
              message: compatibleMessage,
            })
            break
          case 'expire':
            const worldExpired = await this.realm?.expired('Jealm')
            if (worldExpired) {
              const { daysLeft, expired, expiredTrial } = worldExpired
              let expiredMessage = ''
              if (expired && expiredTrial) {
                expiredMessage = `Jealm subscription has expired`
              } else {
                expiredMessage = `There are ${daysLeft} days remaining until the Jealm subscription expire`
              }
              this.bot.sendMessage({
                to: channelID,
                message: expiredMessage,
              })
            } else {
              this.bot.sendMessage({
                to: channelID,
                message: `Something went wrong`,
              })
            }
            break
        }
      }
    })
  }
}
