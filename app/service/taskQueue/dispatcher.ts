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
      console.log('no queue found')
      this.ctx.app.getLogger('taskLogger').error(`[Job Execution Error ${uuid} ] Job Queue Not Found: ${queue}`)
      return
    }

    const { jobPointer, status } = queue
    if (status === 'completed') {
      // 当前队列已完成
      console.log('queue is finished')
      this.ctx.app.getLogger('taskLogger').error(`[Job Execution Error ${uuid} ] Job Queue Is Not Pending: ${status}`)
      return
    }

    const jobWillBeDispatched = queue.jobs[jobPointer]
    const deviceStatus = await this.ctx.service.taskQueue.device.index(jobWillBeDispatched.connectionName)
    if (!deviceStatus.online) {
      // 执行当前job的设备不在线
      console.log('device is not online')
      this.ctx.app
        .getLogger('taskLogger')
        .error(`[Job Execution Error ${uuid} ] Device Is Offline: ${jobWillBeDispatched.connectionName}`)
    }

    if (deviceStatus.locked) {
      // 执行当前job的设备被锁住
      console.log('device is locked')
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

    // 尝试执行当前job
    console.log('doing job execution')
    const job = queue.jobs[jobPointer]
    await this.ctx.service.taskQueue.queue.update(uuid, 'running')
    await this.ctx.service.taskQueue.device.update(jobWillBeDispatched.connectionName, undefined, true)
    this.ctx.app.mqttClient.publish(job.apiTopic, JSON.stringify({ ...job.args, uuid }), async () => {
      this.ctx.app
        .getLogger('taskLogger')
        .info(`[Job Execution Info ${uuid} ] Job ${jobWillBeDispatched.name || 'name not found'} Is Running`)
      await this.ctx.service.taskQueue.monitor.push({
        uuid,
        connectionName: job.connectionName,
        apiTopic: job.apiTopic,
        args: job.args,
      })
    })
  }

  async dispatchPending(connectionName: string) {
    const device = await this.ctx.service.taskQueue.device.index(connectionName)
    const { pendingQueue, locked, online } = device
    const jobWillBeDispatched = pendingQueue[0]
    console.log('dispatch pending', jobWillBeDispatched)
    const newQueue = pendingQueue.slice(1, pendingQueue.length)
    await this.dispatch(jobWillBeDispatched)
    await this.ctx.service.taskQueue.device.update(connectionName, undefined, false, newQueue)
  }

  async retry() {} // 重试任务
}
