import { Service, Context, Singleton } from 'egg'
import IORedis = require('ioredis')

export default class Redis extends Service {
  private redis: IORedis.Redis & Singleton<IORedis.Redis>
  constructor(ctx: Context) {
    super(ctx)
    this.redis = ctx.app.redis
  }
  async set(key: string, value: string, seconds = 86400) {
    value = JSON.stringify(value)
    if (!seconds) {
      await this.redis.set(key, value)
    } else {
      await this.redis.set(key, value, 'EX', seconds)
    }
  }
  async get(key) {
    const { redis } = this.app
    let data = await redis.get(key)
    if (!data) return
    data = JSON.parse(data)
    return data
  }
  async getAllKey() {
    await this.redis.keys('*', (err, value) => {
      if (err) throw err
      return value
    })
  }
  async flushAll() {
    const { redis } = this.app
    redis.flushall()
    return
  }
}
