import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const triggerRule = {
  name: 'string',
  jobId: { type: 'array', itemType: 'number' },
}
export default class HomeController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const params = ctx.service.util.filter({ id: query.id, name: query.name, jobId: query.jobId })
    const result = await ctx.service.trigger.index(params)

    const body = {} as IBody
    body.data = {
      trigger: result[0],
      count: result[1],
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const newTrigger = ctx.request.body
    const body = {} as IBody
    ctx.validate(triggerRule, newTrigger)
    const res = await ctx.service.trigger.create(newTrigger)

    body.code = 200
    body.data = { newTrigger: res }
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const newTrigger = ctx.request.body
    const body = {} as IBody
    ctx.validate(triggerRule, newTrigger)
    const res = await ctx.service.trigger.update(id, newTrigger)

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
    const res = await ctx.service.trigger.destroy(id)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
