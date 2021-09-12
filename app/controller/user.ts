import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const userRule = {
  username: 'string',
  group: { type: 'array', itemType: 'number', required: false },
}
export default class UserController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const params = ctx.service.util.filter({ id: query.id, name: query.username })
    const result = await ctx.service.user.index(params)

    const body = {} as IBody
    body.data = {
      user: result[0],
      count: result[1],
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const newUser = ctx.request.body
    const body = {} as IBody
    ctx.validate(userRule, newUser)
    const res = await ctx.service.user.create(newUser)

    body.code = 200
    body.data = { newUser: res }
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const newUser = ctx.request.body
    const body = {} as IBody
    ctx.validate(userRule, newUser)
    const res = await ctx.service.user.update(id, newUser)

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
    const res = await ctx.service.user.destroy(id)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async refreshToken() {
    const { ctx } = this
    const body = {} as IBody
    console.log(ctx.header.authorization)
    const res = await ctx.service.user.refreshToken(ctx.header.authorization!)

    body.code = 200
    body.data = res
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
