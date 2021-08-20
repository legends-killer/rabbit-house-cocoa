import { IPluginContext } from '../../../typings/types'
/**
 * call other devices by sending mqtt message
 */
export default () => {
  return async (ctx: IPluginContext, next: any): Promise<any> => {
    await next()
    console.log(ctx)
    const trigger = await ctx.service.mqtt.trigger.getTrigger({ topic: ctx.req.topic, fuzzy: false }) // 判断本次收到的请求是否需要触发自定义操作，这里只会出现一个trigger
    if (trigger[0].scheduleId) {
      // todo: call schedule work
    }
  }
}
