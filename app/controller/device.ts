import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const deviceRule = {
  clientName: 'string',
  description: 'string?', // allow empty string
  connectionName: 'string',
  api: 'deviceApi',
  topic: { type: 'array', itemType: 'string', required: false },
  active: 'boolean?',
  receiveMiddleware: { type: 'array', itemType: 'string', required: false },
}

class DeviceController extends Controller {
  filter(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === '' || obj[key] === null) {
        delete obj[key]
      }
    })
    return obj
  }
  async index() {
    const { ctx, filter } = this
    const query = ctx.query
    const body = {} as IBody
    const params = filter({ id: query.id, clientName: query.clientName, active: query.active ? query.active === '1' : true })
    const res = await ctx.service.device.index(params)

    body.data = {
      device: res[0],
      count: res[1],
    }
    body.code = 200
    body.msg = 'success'
    body.error = 0
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const newDevice = ctx.request.body
    const body = {} as IBody
    ctx.validate(deviceRule, newDevice)
    const res = await ctx.service.device.create(newDevice)

    body.code = 200
    body.data = { newDevice: res }
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const newDevice = ctx.request.body
    const body = {} as IBody
    ctx.validate(deviceRule, newDevice)
    const res = await ctx.service.device.update(id, newDevice)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id
    const res = await ctx.service.device.destroy(id)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}

export default DeviceController
