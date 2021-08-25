import { Controller } from 'egg'
import { IPluginContext } from '../../../typings/types'

export default class MqttController extends Controller {
  public async index() {
    const ctx = this.ctx as IPluginContext
    console.log('我tm是controller', ctx.req.topic, ctx.req.message)
    // todo: 处理device完成任务后的回调
    this.service.tool.redis.set('mqtt', ctx.req.topic, JSON.parse(ctx.req.message), 86400)
  }
}
