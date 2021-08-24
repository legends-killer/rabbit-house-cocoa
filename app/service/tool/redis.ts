import { Service, Singleton } from 'egg'
import { Redis } from 'ioredis'

export default class RedisTool extends Service {
  private redis = this.app.redis as Singleton<Redis> & Redis
  async set(db: string, key: string, value: any, seconds?: number) {
    const { redis } = this
    value.timeOnRedis = new Date()
    value = JSON.stringify(value)
    if (!seconds) {
      await redis.get(db).set(key, value)
    } else {
      await redis.get(db).expire(key, seconds)
      return await redis.get(db).set(key, value)
    }
  }

  async get(db: string, key: string) {
    const { redis } = this
    const data = await redis.get(db).get(key)
    if (!data) return
    return JSON.parse(data)
  }

  async delete(db: string, key: string) {
    return await this.redis.get(db).del(key)
  }

  async setArr(db: string, key: string, value: any, seconds?: number) {
    // append timestrap to redis array
    const { redis } = this
    value.timeOnRedis = new Date()
    value = JSON.stringify(value)
    if (!seconds) {
      await redis.get(db).rpush(key, value)
    } else {
      await redis.get(db).expire(key, seconds)
      return await redis.get(db).rpush(key, value)
    }
  }

  async getArr(db: string, key: string) {
    const { redis } = this
    const data = await redis.get(db).lrange(key, 0, -1)
    if (!data) return
    return data.map((d) => {
      return JSON.parse(d)
    })
  }

  async getAllKey(db: string) {
    const { redis } = this
    return await redis.get(db).keys('*')
  }

  async flushAll(db: string) {
    const { redis } = this
    redis.get(db).flushall()
    return
  }
}
