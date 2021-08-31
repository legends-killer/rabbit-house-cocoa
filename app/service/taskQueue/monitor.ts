/**
 * 监视器
 * 负责提供监控队列执行情况的方法
 * 监视某个任务执行时间是否超出预期
 */
import { Service } from 'egg'

interface IJobExecution {
  uuid: string
  connectionName: string
  apiTopic: string
  args: {
    [index: string]: any
  }
  timeOnRedis?: string
}

export default class MonitorService extends Service {
  async push(job: IJobExecution) {
    const { ctx } = this
    await ctx.service.tool.redis.setArr('job', 'monitor', job)
  }

  async pop(uuid: string) {
    const { ctx } = this
    const monitorQueue = await this.index()
    for (const i in monitorQueue) {
      if (monitorQueue[i].uuid === uuid) {
        ctx.service.tool.redis.delArrItem('job', 'monitor', 1, JSON.stringify(monitorQueue[i]))
        break
      }
    }
  }

  async index() {
    return ((await this.ctx.service.tool.redis.getArr('job', 'monitor')) as IJobExecution[]) || ([] as IJobExecution[])
  }
}
