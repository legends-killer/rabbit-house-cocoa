import 'egg'
import { IncomingMessage } from 'http'
import { Redis } from 'ioredis'
declare module 'egg' {
  interface Application {
    mqtt: any
    redis: Singleton<Redis> & Redis
  }
}
