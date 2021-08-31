import { Service, Singleton } from 'egg'
import { Redis } from 'ioredis'
import { IRedisDbName } from '../../types'

export default class RedisService extends Service {
  private redis = this.app.redis as Singleton<Redis> & Redis
  async set(db: IRedisDbName, key: string, value: any, seconds?: number) {
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

  async get(db: IRedisDbName, key: string) {
    const { redis } = this
    const data = await redis.get(db).get(key)
    if (!data) return
    return JSON.parse(data)
  }

  async delete(db: IRedisDbName, key: string) {
    return await this.redis.get(db).del(key)
  }

  async setArr(db: IRedisDbName, key: string, value: any, seconds?: number) {
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

  async getArr(db: IRedisDbName, key: string) {
    const { redis } = this
    const data = await redis.get(db).lrange(key, 0, -1)
    if (!data) return
    return data.map((d) => {
      return JSON.parse(d)
    })
  }

  async delArrItem(db: IRedisDbName, key: string, count: number, value: string) {
    const { redis } = this
    return await redis.get(db).lrem(key, count, value)
  }

  async getAllKey(db: IRedisDbName) {
    const { redis } = this
    return await redis.get(db).keys('*')
  }

  async flushAll(db: IRedisDbName) {
    const { redis } = this
    redis.get(db).flushall()
    return
  }
}
