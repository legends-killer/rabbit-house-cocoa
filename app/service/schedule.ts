import { Service } from 'egg'

export default class ScheduleService extends Service {
  async index(params: { id?: number; name?: string }) {
    const db = this.ctx.repo
    const job = db.Schedule.createQueryBuilder()
    job.where('deletedAt Is NULL')
    if (params.id) job.andWhere('id = :id', { id: params.id })
    if (params.name) job.andWhere('name = :name', { name: params.name })
    job.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await job.getManyAndCount()
  }
}
