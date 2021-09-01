import { Service } from 'egg'
import Log from '../entity/log'

export default class LogService extends Service {
  /**
   * 查询日志
   * @param params from,to 传入时间戳number
   */
  async index(params: { id?: number; domain?: string; from?: number | Date; to?: number | Date; page: number; ipp: number }) {
    const db = this.ctx.repo.Log
    const log = db.createQueryBuilder()
    log.where('deletedAt Is NULL')

    if (params.from)
      log.andWhere('createdAt >= :date', { date: new Date(params.from).toISOString().replace('T', ' ').slice(0, 19) })
    if (params.to) log.andWhere('createdAt <= :date', { date: new Date(params.to).toISOString().replace('T', ' ').slice(0, 19) })
    if (params.id) log.andWhere(`id = :id`, { id: params.id })
    if (params.domain) log.andWhere(`domain = :domain`, { domain: params.domain })

    log
      .skip((params.page - 1) * params.ipp)
      .take(params.ipp)
      .orderBy('createdAt', 'DESC') // paging & ordering

    return await log.getManyAndCount()
  }

  async create(log: Log) {
    const db = this.ctx.repo.Log
    return await db.save(log)
  }

  async destroy(id?: number | string, from?: number, to?: number) {
    // 可批量删除
    const db = this.ctx.repo.Log
    const log = db.createQueryBuilder().update().set({ deletedAt: new Date() }).where('deletedAt Is NULL')

    if (id) log.andWhere('id = :id', { id })
    if (from) log.andWhere('createdAt >= :date', { date: new Date(from).toISOString().replace('T', ' ').slice(0, 19) })
    if (to) log.andWhere('createdAt <= :date', { date: new Date(to).toISOString().replace('T', ' ').slice(0, 19) })

    return await log.execute()
  }
}
