import { Controller } from 'egg'
import { IPluginContext } from '../../../typings/types'

export default class MqttController extends Controller {
  public async index() {
    const ctx = this.ctx as IPluginContext
    console.log('我tm是controller', ctx.req.topic, ctx.req.message)
    const { topic, message } = ctx.req
    this.service.tool.redis.setArr('mqtt', topic, message, 86400)

    const apiDoneReg = /.*(?<=done)$/
    let currentQueueIsDone = false
    let retryCurrentJob = false
    if (apiDoneReg.test(topic)) {
      // 收到任务执行完成的信息
      const { uuid } = message
      const queue = await ctx.service.taskQueue.queue.index(uuid)
      const { jobs, jobPointer } = queue
      const device = await ctx.service.taskQueue.device.index(jobs[jobPointer].connectionName)
      console.log('pending queue', device.pendingQueue)

      // 先解除锁，pop监视器栈
      await Promise.all([
        ctx.service.taskQueue.device.update(jobs[jobPointer].connectionName, undefined, false),
        ctx.service.taskQueue.monitor.pop(uuid),
      ])

      if (!ctx.req.message.success) {
        // 执行任务未成功
        ctx
          .getLogger('taskLogger')
          .error(`[Job Execution Error ${message.uuid} ] device: ${message.device} error: ${message.error}`)
        await ctx.service.taskQueue.queue.update(uuid, undefined, undefined, {
          level: 'error',
          domain: `taskQueueMainJob-${queue.mainJobId}`,
          msg: `the NO.${jobPointer} job ${queue.jobs[jobPointer].name ?? 'name not fount'} has error. uuid: ${
            message.uuid
          } device: ${message.device} error: ${message.error}`,
        })
        // todo: send error message
        if (queue.maxRetryAttempts > 0) {
          // retry current job
          retryCurrentJob = true
        } else {
          // save task queue
          Promise.all([ctx.service.taskQueue.queue.update(uuid, 'exit'), ctx.service.taskQueue.queue.save(uuid)])
        }
      } else {
        // 执行任务成功
        await ctx.service.taskQueue.queue.update(uuid, undefined, undefined, {
          msg: `the NO.${jobPointer} job ${queue.jobs[jobPointer].name ?? 'name not fount'} finished successfully`,
          level: 'info',
          domain: `taskQueueMainJob-${queue.mainJobId}`,
        })
      }

      if (ctx.service.mqtt.job.isFinished(queue) && !retryCurrentJob) {
        // 队列已完成
        console.log('queue done!!!')
        currentQueueIsDone = true
        Promise.all([ctx.service.taskQueue.queue.update(uuid, 'completed'), ctx.service.taskQueue.queue.save(uuid)])
      }

      // 重试当前任务
      if (retryCurrentJob) {
        await ctx.service.taskQueue.queue.update(
          uuid,
          undefined,
          jobPointer,
          { msg: `retry NO.${jobPointer} job`, level: 'warn', domain: `taskQueueMainJob-${queue.mainJobId}` },
          queue.maxRetryAttempts - 1
        )
        await ctx.service.taskQueue.dispatcher.dispatch(uuid)
        return
      }

      // 当前设备状态
      if (device.pendingQueue.length === 0) {
        // queue is empty
        // dispatch next directly
        console.log('dispatch next directly')
        if (!currentQueueIsDone) {
          console.log('dispatch next')
          await ctx.service.taskQueue.queue.update(uuid, undefined, jobPointer + 1)
          await ctx.service.taskQueue.dispatcher.dispatch(uuid)
        }
      } else {
        // queue is not empty
        // dispatch pendingQueue first
        console.log('dispatch pendingQueue first')
        await ctx.service.taskQueue.dispatcher.dispatchPending(jobs[jobPointer].connectionName)
        if (!currentQueueIsDone) {
          console.log('dispatch next')
          await ctx.service.taskQueue.queue.update(uuid, undefined, jobPointer + 1)
          await ctx.service.taskQueue.dispatcher.dispatch(uuid)
        }
      }
    }
  }
}
