import { Service } from 'egg'
import User from '../entity/user'

export default class UserService extends Service {
  async index(params: { id?: number; username?: string; token?: string }) {
    const db = this.ctx.repo.User
    const user = db.createQueryBuilder()
    user.where('deletedAt Is NULL')
    if (params.id) user.andWhere('id = :id', { id: params.id })
    if (params.username) user.andWhere('username = :username', { username: params.username })
    if (params.token) user.andWhere('token = :token', { token: params.token })
    return await user.getManyAndCount()
  }

  async create(user: User) {
    const db = this.ctx.repo.User
    user.token = this.app.jwt.sign({ username: user.username }, this.app.config.jwt.secret)
    user.tokenExp = new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
    return await db.save(user)
  }

  async update(id: number, newUser: User) {
    const db = this.ctx.repo.User
    const rawWillBeUpdated = await db.findOne({ id })
    newUser = { ...rawWillBeUpdated, ...newUser, updatedAt: new Date() }
    return await db.update(id, newUser)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.User
    const rawWillBeUpdated = await db.findOne({ id })
    const deletedUser = { ...rawWillBeUpdated, deletedAt: new Date() } as User
    return await db.update(id, deletedUser)
  }

  async refreshToken(token: string) {
    const db = this.ctx.repo.User
    console.log(token)
    const user = await this.service.tool.redis.get('sys', token)
    if (!user) this.ctx.throw(403, 'old token is invalid', { code: '40300' })

    delete user.timeOnRedis
    await this.service.tool.redis.delete('sys', token)

    const newToken = this.app.jwt.sign({ username: user.username }, this.app.config.jwt.secret)
    const newUser = { ...user, token: newToken, tokenExp: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000) }
    await Promise.all([db.update(newUser.id, newUser), this.service.tool.redis.set('sys', newToken, newUser)])

    return { newToken }
  }
}
