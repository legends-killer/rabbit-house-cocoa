import { Controller } from 'egg'
import { IBody } from '../../typings/types'

export default class SettingsController extends Controller {
  async index() {}

  async create() {}

  async update() {}

  async destroy() {}

  async refreshMqttTopic() {
    const result = await this.service.util.refreshMqttListener()
    const body = {} as IBody
    body.data = { success: result }
    body.error = 0
    body.code = 200
    body.msg = 'success'

    this.ctx.body = body
  }

  async restartMqttServer() {}
}
