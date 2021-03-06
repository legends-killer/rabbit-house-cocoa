/**
 * 任务队列
 * 封装任务队列的操作方法
 * 维护任务状态的方法
 * 被阻塞等待的任务
 */
import { Service } from 'egg'
import { v4 as uuidv4 } from 'uuid'
import { ITaskQueue, IJobWork, ITaskQueueExecLog } from '../../types'

export default class QueueService extends Service {
  async index(uuid: string) {
    const queue = ((await this.ctx.service.tool.redis.get('job', uuid)) as ITaskQueue) || {}
    return queue
  }

  async create(mainJobId: number, jobs: IJobWork[]) {
    const mainJob = (await this.service.job.index({ id: mainJobId }))[0].pop()
    if (!mainJob) this.ctx.throw(404, 'main job not found', { code: '40401' })

    const queueItem = {} as ITaskQueue
    queueItem.mainJobId = mainJobId
    queueItem.status = 'pending'
    queueItem.jobPointer = 0
    queueItem.jobs = jobs
    queueItem.execLog = []
    queueItem.maxRetryAttempts = mainJob.maxRetryAttempts
    const uuid = uuidv4()

    await this.ctx.service.tool.redis.set('job', uuid, queueItem)
    return uuid
  }

  async update(
    uuid: string,
    status?: 'pending' | 'running' | 'completed' | 'exit',
    jobPointer?: number,
    newLog?: ITaskQueueExecLog,
    retryTimes?: number
  ) {
    const itemWillUpdate = await this.index(uuid)
    if (status) itemWillUpdate.status = status
    if (jobPointer) itemWillUpdate.jobPointer = jobPointer
    if (newLog) itemWillUpdate.execLog.push(newLog)
    if (retryTimes) itemWillUpdate.maxRetryAttempts = retryTimes

    return await this.ctx.service.tool.redis.set('job', uuid, itemWillUpdate)
  }

  async save(uuid: string) {
    const queue = await this.index(uuid)
    return await this.ctx.repo.Log.createQueryBuilder().insert().values(queue.execLog).execute()
  }

  async destroy(uuid: string) {
    // destroy
    return await this.ctx.service.tool.redis.delete('job', uuid)
  }
}
