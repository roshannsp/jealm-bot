import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../.env') })

export const USER = {
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
}
export const MINECRAFT = {
  USER: process.env.MINECRAFT_USER,
  VERSION: process.env.MINECRAFT_VERSION,
}
export const TOKEN = process.env.TOKEN
export const API = {
  AUTH: 'https://authserver.mojang.com',
  REALM: 'https://pc.realms.minecraft.net',
  MOJANG: 'https://api.mojang.com',
}
