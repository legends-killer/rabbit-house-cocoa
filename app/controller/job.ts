import { Controller } from 'egg'
import { IBody } from '../../typings/types'
const jobRule = {
  name: 'string',
  description: 'string?',
  sendResult: 'boolean?',
  waitBefore: 'number?',
  work: 'array',
}
export default class JobController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const params = ctx.service.util.filter({ id: query.id, name: query.name })
    const result = await ctx.service.job.index(params)

    const body = {} as IBody
    body.data = {
      job: result[0],
      count: result[1],
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const newJob = ctx.request.body
    const body = {} as IBody
    ctx.validate(jobRule, newJob)
    const res = await ctx.service.job.create(newJob)

    body.code = 200
    body.data = { newJob: res }
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const newJob = ctx.request.body
    const body = {} as IBody
    ctx.validate(jobRule, newJob)
    const res = await ctx.service.job.update(id, newJob)

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
    const res = await ctx.service.job.destroy(id)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
