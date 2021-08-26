/**
 * 任务队列
 * 封装任务队列的操作方法
 * 维护任务状态的方法
 * 被阻塞等待的任务
 */
import { Service } from 'egg'
import { v4 as uuidv4 } from 'uuid'
import { ITaskQueue, IJobWork } from '../../types'

export default class QueueService extends Service {
  async index(uuid: string) {
    const queue = JSON.parse((await this.ctx.service.tool.redis.get('device', uuid)) || '{}') as ITaskQueue
    return queue
  }

  async create(jobs: IJobWork[]) {
    const queueItem = {} as ITaskQueue
    queueItem.status = 'pending'
    queueItem.jobPointer = 0
    queueItem.jobs = jobs

    return await this.ctx.service.tool.redis.set('job', uuidv4(), JSON.stringify(queueItem))
  }

  async update(uuid: string, status?: 'pending' | 'running' | 'completed', jobPointer?: number) {
    const itemWillUpdate = await this.index(uuid)
    if (status) itemWillUpdate.status = status
    if (jobPointer) itemWillUpdate.jobPointer = jobPointer

    return await this.ctx.service.tool.redis.set('job', uuid, JSON.stringify(itemWillUpdate))
  }

  async destroy(uuid: string) {
    return await this.ctx.service.tool.redis.delete('job', uuid)
  }
}
