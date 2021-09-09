import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const scheduleRule = {
  name: 'string',
  description: 'string?',
  triggerId: 'number',
  dispatchTime: 'string', // cron
}

export default class ScheduleController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const params = ctx.service.util.filter({ id: query.id, name: query.name, triggerId: query.triggerId })
    const result = await ctx.service.schedule.index(params)

    const body = {} as IBody
    body.data = {
      schedule: result[0],
      count: result[1],
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const newSchedule = ctx.request.body
    const body = {} as IBody
    ctx.validate(scheduleRule, newSchedule)
    const res = await ctx.service.schedule.create(newSchedule)

    body.code = 200
    body.data = { newSchedule: res }
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const newSchedule = ctx.request.body
    const body = {} as IBody
    ctx.validate(scheduleRule, newSchedule)
    const res = await ctx.service.schedule.update(id, newSchedule)

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
    const res = await ctx.service.schedule.destroy(id)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
