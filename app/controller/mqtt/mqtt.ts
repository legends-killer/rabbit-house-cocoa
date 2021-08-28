import { Controller } from 'egg'
import { IPluginContext } from '../../../typings/types'

export default class MqttController extends Controller {
  public async index() {
    const ctx = this.ctx as IPluginContext
    console.log('我tm是controller', ctx.req.topic, ctx.req.message)
    const { topic, message } = ctx.req
    // todo: 处理device完成任务后的回调
    const apiDoneReg = /.*(?<=done)$/
    this.service.tool.redis.set('mqtt', topic, message, 86400)
    if (apiDoneReg.test(topic)) {
      // 收到任务执行完成的信息
      if (!ctx.req.message.success) {
        // 执行任务未成功
        ctx
          .getLogger('taskLogger')
          .error(`[Job Execution Error ${message.uuid} ] device: ${message.device} error: ${message.error}`)
        // todo: send error message
        return
      }
      const { uuid } = message
      const queue = await ctx.service.taskQueue.queue.index(uuid)
      if (ctx.service.mqtt.job.isFinished(queue)) {
        // 队列已完成
        return
      }

      const { jobs, jobPointer } = queue
      // 当前设备状态
      const device = await ctx.service.taskQueue.device.index(jobs[jobPointer].connectionName)
      if (device.pendingQueue.length === 0) {
        // queue is empty
        // dispatch next directly
        await ctx.service.taskQueue.device.update(jobs[jobPointer].connectionName, undefined, false, [])
        await ctx.service.taskQueue.queue.update(uuid, undefined, jobPointer + 1)
        await ctx.service.taskQueue.dispatcher.dispatch(uuid)
      } else {
        // queue is not empty
        // dispatch pendingQueue first
        await ctx.service.taskQueue.device.update(jobs[jobPointer].connectionName, undefined, false, [])
        await ctx.service.taskQueue.dispatcher.dispatchPending(jobs[jobPointer].connectionName)
        await ctx.service.taskQueue.queue.update(uuid, undefined, jobPointer + 1)
        await ctx.service.taskQueue.dispatcher.dispatch(uuid)
      }
    }
  }
}
