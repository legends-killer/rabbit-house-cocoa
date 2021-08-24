import { IPluginContext } from '../../../typings/types'
/**
 * call other devices by sending mqtt message
 */
export default () => {
  return async (ctx: IPluginContext, next: any): Promise<any> => {
    await next()
    const trigger = await ctx.service.mqtt.trigger.getTrigger({ topic: ctx.req.topic, fuzzy: false }) // 判断本次收到的请求是否需要触发自定义操作，这里只会出现一个trigger
    if (trigger && trigger[0].scheduleId) {
      // todo: call schedule exec
      const jobs = await ctx.service.mqtt.job.assembleJob(trigger[0].scheduleId)
      console.log(jobs)
    }
  }
}
