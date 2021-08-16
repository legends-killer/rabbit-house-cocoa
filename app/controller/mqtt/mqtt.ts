import { Controller } from 'egg'
import { IPluginContext } from '../../../typings/types'

export default class MqttController extends Controller {
  public async index() {
    const ctx = this.ctx as IPluginContext
    console.log('我tm是controller', ctx.req.topic, ctx.req.message)
    this.service.tool.redis.set(ctx.req.topic, ctx.req.message, 20000)
  }
}
