import { Service } from 'egg'

export default class TriggerService extends Service {
  /**
   * 通用方法，查询自定义的触发器，传参传对象
   * @param {Object} params 参数对象
   * 支持参数：
   * {number} id trigger id
   * {number} deviceId 设备id
   * {number} scheduleId 任务id
   * {string} topic 设备支持订阅的topic，可以模糊搜索
   * {boolean} fuzzy 模糊查询控制，默认为true
   */
  async getTrigger(params: { id?: number; deviceId?: number; scheduleId?: number; topic?: string; fuzzy?: boolean }) {
    const db = this.ctx.repo
    const trigger = db.Trigger.createQueryBuilder()
    trigger.where('deletedAt IS NULL')
    if (params.topic) {
      if (params.fuzzy === false) trigger.andWhere('topic = :topic', { topic: params.topic })
      else trigger.andWhere('topic LIKE :topic', { topic: '%' + params.topic + '%' })
    }
    if (params.id) trigger.andWhere('id = :id', { id: params.id })
    if (params.deviceId) trigger.andWhere('deviceId = :deviceId', { deviceId: params.deviceId })
    if (params.scheduleId) trigger.andWhere('scheduleId = :scheduleId', { scheduleId: params.scheduleId })
    return await trigger.getMany()
  }
}
