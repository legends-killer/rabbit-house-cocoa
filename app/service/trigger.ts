import { Service } from 'egg'

export default class TriggerService extends Service {
  /**
   * 通用方法，查询自定义的触发器，传参传对象
   * @param {Object} params 参数对象
   * 支持参数：
   * {number} id trigger id
   * {number} name trigger name
   * {number} JobId 任务id
   */
  async index(params: { id?: number; JobId?: number; name?: string }) {
    const db = this.ctx.repo
    const trigger = db.Trigger.createQueryBuilder()
    trigger.where('deletedAt IS NULL')
    if (params.id) trigger.andWhere('id = :id', { id: params.id })
    if (params.name) trigger.andWhere('name = :name', { name: params })
    if (params.JobId) trigger.andWhere('JobId LIKE :JobId', { JobId: params.JobId })
    return await trigger.getMany()
  }
}
