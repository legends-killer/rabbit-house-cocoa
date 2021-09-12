import { Context } from 'egg'

export default () => {
  return async function tokenHandler(ctx: Context, next: () => Promise<any>) {
    const token = ctx.header.authorization
    if (!token) ctx.throw(401, 'token not found', { code: '40100' })
    // check user
    let user = await ctx.service.tool.redis.get('sys', token)
    if (!user) user = (await ctx.service.user.index({ token }))[0].pop()
    if (!user) ctx.throw(401, 'user not found', { code: '40101' })
    // check exp
    if (new Date(user.tokenExp).getTime() < new Date().getTime()) ctx.throw(401, 'token expired', { code: '40102' })
    // ok & update redis
    await ctx.service.tool.redis.set(
      'sys',
      user.token,
      user,
      Math.floor((new Date(user.tokenExp).getTime() - new Date().getTime()) / 1000)
    )
    await next()
  }
}
