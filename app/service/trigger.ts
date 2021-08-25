import { Service } from 'egg'

export default class TriggerService extends Service {
  /**
   * 通用方法，查询自定义的触发器，传参传对象
   * @param {Object} params 参数对象
   * 支持参数：
   * {number} id trigger id
   * {number} deviceId 设备id
   * {number} JobId 任务id
   */
  async index(params: { id?: number; JobId?: number }) {
    const db = this.ctx.repo
    const trigger = db.Trigger.createQueryBuilder()
    trigger.where('deletedAt IS NULL')
    if (params.id) trigger.andWhere('id = :id', { id: params.id })
    if (params.JobId) trigger.andWhere('JobId = :JobId', { JobId: params.JobId })
    return await trigger.getMany()
  }
}
