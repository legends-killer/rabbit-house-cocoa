import { Controller } from 'egg'
import { IBody } from '../../typings/types'

export default class LogController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const params = ctx.service.util.filter({
      id: query.id,
      domain: query.domain,
      from: Number(query.from),
      to: Number(query.to),
      page: query.page,
      ipp: query.ipp,
    })
    const result = await ctx.service.log.index(params)

    const body = {} as IBody
    body.data = {
      job: result[0],
      count: result[1],
      page: Number(query.page),
      ipp: Number(query.ipp),
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const { id, from, to } = ctx.query
    const res = await ctx.service.log.destroy(id, Number(from), Number(to))

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
