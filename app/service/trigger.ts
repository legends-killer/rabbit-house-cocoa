import { Service } from 'egg'
import Trigger from '../entity/trigger'

export default class TriggerService extends Service {
  /**
   * 通用方法，查询自定义的触发器，传参传对象
   * @param {Object} params 参数对象
   * 支持参数：
   * {number} id trigger id
   * {number} name trigger name
   * {number} jobId 任务id
   */
  async index(params: { id?: number; jobId?: number; name?: string }) {
    const db = this.ctx.repo
    const trigger = db.Trigger.createQueryBuilder()
    trigger.where('deletedAt IS NULL')
    if (params.id) trigger.andWhere('id = :id', { id: params.id })
    if (params.name) trigger.andWhere('name = :name', { name: params })
    if (params.jobId) trigger.andWhere('jobId LIKE :jobId', { jobId: params.jobId })
    return await trigger.getManyAndCount()
  }

  async create(trigger: Trigger) {
    const db = this.ctx.repo
    return await db.Trigger.save(trigger)
  }

  async update(id: number, newTrigger: Trigger) {
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Trigger.findOne({ id })
    newTrigger = { ...rawWillBeUpdated, ...newTrigger, updatedAt: new Date() }
    return await db.Trigger.update(id, newTrigger)
  }

  async destroy(id: number) {
    // soft delete
    console.log('id', id)
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Trigger.findOne({ id })
    const deletedTrigger = { ...rawWillBeUpdated, deletedAt: new Date() } as Trigger
    return await db.Trigger.update(id, deletedTrigger)
  }
}
