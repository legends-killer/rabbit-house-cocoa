import { Service } from 'egg'
import Job from '../entity/job'

export default class JobService extends Service {
  async index(params: { id?: number; name?: string }) {
    const db = this.ctx.repo
    const job = db.Job.createQueryBuilder()
    job.where('deletedAt Is NULL')
    if (params.id) job.andWhere('id = :id', { id: params.id })
    if (params.name) job.andWhere('name = :name', { name: params.name })
    job.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await job.getManyAndCount()
  }

  async create(job: Job) {
    const db = this.ctx.repo
    return await db.Job.save(job)
  }

  async update(id: number, newJob: Job) {
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Job.findOne({ id })
    newJob = { ...rawWillBeUpdated, ...newJob, updatedAt: new Date() }
    return await db.Job.update(id, newJob)
  }

  async destroy(id: number) {
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Job.findOne({ id })
    const deletedjob = { ...rawWillBeUpdated, deletedAt: new Date() } as Job
    return await db.Job.update(id, deletedjob)
  }
}
