import { Controller } from 'egg'

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this
    ctx.body = await ctx.service.tool.redis.get('esp32-cam/info')
    const app = this.app
  }
}
