import { Service, Context, Singleton } from 'egg'
import IORedis = require('ioredis')

export default class Redis extends Service {
  private redis: IORedis.Redis & Singleton<IORedis.Redis>
  constructor(ctx: Context) {
    super(ctx)
    this.redis = ctx.app.redis
  }
  async set(key: string, value: any, seconds = 86400) {
    // append timestrap to redis array
    value.timeOnRedis = new Date()
    value = JSON.stringify(value)
    if (!seconds) {
      await this.redis.rpush(key, value)
    } else {
      await this.redis.expire(key, seconds)
      await this.redis.rpush(key, value)
    }
  }
  async get(key: string) {
    const { redis } = this.app
    const data = await redis.lrange(key, 0, -1)
    if (!data) return
    return data.map((d) => {
      return JSON.parse(d)
    })
  }
  async getAllKey() {
    return await this.redis.keys('*')
  }
  async flushAll() {
    const { redis } = this.app
    redis.flushall()
    return
  }
}
