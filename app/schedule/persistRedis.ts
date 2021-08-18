import { Subscription } from 'egg'
import Redis from '../entity/redis'

export default class PersistRedis extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 */1 * * *', // save redis to db every hours
      type: 'worker',
      immediate: true,
    }
  }
  async subscribe() {
    const { ctx } = this
    const { app, service, ormManager } = ctx
    const keys = await service.tool.redis.getAllKey()
    const dbAll = [] as Redis[]
    try {
      for (const key of keys) {
        const values = (await service.tool.redis.get(key)) || []

        // find the last persisted value
        const db = ctx.repo.Redis.createQueryBuilder('redis')
        db.where('redis.key = :key', { key })
        db.orderBy('createdAt', 'DESC')
        const lastPersistedTime = (await db.getOne())?.CreatedAt

        values.forEach((value: any) => {
          if (lastPersistedTime && new Date(value.timeOnRedis) <= lastPersistedTime) return // skip records that are already persisted
          const dbRaw = new Redis()
          dbRaw.key = key
          dbRaw.CreatedAt = value.timeOnRedis
          delete value.timeOnRedis
          delete value.persisted
          dbRaw.value = JSON.stringify(value)
          dbAll.push(dbRaw)
        })
      }
      await ormManager.save(dbAll)
    } catch (error) {
      console.log(error)
      app.logger.error(`[schedule redis persistence error] ${error}`)
    }
  }
}
