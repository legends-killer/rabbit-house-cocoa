/**
 * 任务调度器
 * 负责任务队列的调度，执行，中断
 * 控制任务状态的维护
 * 重试机制
 */
import { Service } from 'egg'
import { ITaskQueue, IJobWork, IDeviceStatus } from '../../types'

export default class DispatchService extends Service {
  /**
   * 尝试执行任务队列中指针指向的任务
   * @param uuid 任务队列id
   */
  async dispatch(uuid: string) {
    const queue = await this.ctx.service.taskQueue.queue.index(uuid)
    if (JSON.stringify(queue) === '{}') {
      // 找不到执行队列
      this.ctx.app.getLogger('taskLogger').error(`[Job Execution Error ${uuid} ] Job Queue Not Found: ${queue}`)
      return
    }

    const { jobPointer, status } = queue
    if (status === 'completed') {
      // 当前队列已完成
      this.ctx.app.getLogger('taskLogger').error(`[Job Execution Error ${uuid} ] Job Queue Is Not Pending: ${status}`)
      return
    }

    const jobWillBeDispatched = queue.jobs[jobPointer]
    const deviceStatus = await this.ctx.service.taskQueue.device.index(jobWillBeDispatched.connectionName)
    if (!deviceStatus.online) {
      // 执行当前job的设备不在线
      this.ctx.app
        .getLogger('taskLogger')
        .error(`[Job Execution Error ${uuid} ] Device Is Offline: ${jobWillBeDispatched.connectionName}`)
      return
    }

    if (deviceStatus.locked) {
      // 执行当前job的设备被锁住
      deviceStatus.pendingQueue.push(uuid)
      Promise.all([
        this.ctx.service.taskQueue.queue.update(uuid, 'pending'),
        this.ctx.service.taskQueue.device.update(
          jobWillBeDispatched.connectionName,
          undefined,
          undefined,
          deviceStatus.pendingQueue
        ),
      ]).then(() => {
        this.ctx.app
          .getLogger('taskLogger')
          .info(
            `[Job Execution Info ${uuid} ] Job ${
              jobWillBeDispatched.name || 'name not found'
            } Is Pending Because Device Is Locked`
          )
      })
      return
    }

    // 没任何问题，直接执行当前job
    const job = queue.jobs[jobPointer]
    this.ctx.service.taskQueue.queue.update(uuid, 'running')
    this.ctx.app.mqttClient.publish(job.apiTopic, JSON.stringify(job.args), () => {
      this.ctx.app
        .getLogger('taskLogger')
        .info(`[Job Execution Info ${uuid} ] Job ${jobWillBeDispatched.name || 'name not found'} Is Running`)
    })
  }

  async dispatchPending(connectionName: string) {
    const device = await this.ctx.service.taskQueue.device.index(connectionName)
    const { pendingQueue, locked, online } = device
    const jobWillBeDispatched = pendingQueue[0]
    const newQueue = pendingQueue.slice(1, pendingQueue.length)
    await this.dispatch(jobWillBeDispatched)
  }

  async retry() {} // 重试任务
}
