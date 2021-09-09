import { Service } from 'egg'
import Schedule from '../entity/schedule'
import * as parser from 'cron-parser'

export default class ScheduleService extends Service {
  async index(params: { id?: number; name?: string; triggerId?: number }) {
    const db = this.ctx.repo.Schedule
    const schedule = db.createQueryBuilder()
    schedule.where('deletedAt Is NULL')
    if (params.id) schedule.andWhere('id = :id', { id: params.id })
    if (params.name) schedule.andWhere('name = :name', { name: params.name })
    if (params.triggerId) schedule.andWhere('triggerId = :triggerId', { triggerId: params.triggerId })
    schedule.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await schedule.getManyAndCount()
  }

  async create(schedule: Schedule) {
    const db = this.ctx.repo.Schedule
    return await db.save(schedule)
  }

  async update(id: number, newSchedule: Schedule) {
    const db = this.ctx.repo.Schedule
    const rawWillBeUpdated = await db.findOne({ id })
    newSchedule = { ...rawWillBeUpdated, ...newSchedule, updatedAt: new Date() }
    return await db.update(id, newSchedule)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.Schedule
    const rawWillBeUpdated = await db.findOne({ id })
    const deletedSchedule = { ...rawWillBeUpdated, deletedAt: new Date() } as Schedule
    return await db.update(id, deletedSchedule)
  }

  async getNextTick() {
    const allSchedule = (await this.index({}))[0]
    const now = new Date().getTime()
    let nextTick = ''
    let timeDiff = now
    allSchedule.forEach((schedule) => {
      const nextInterval = parser.parseExpression(schedule.dispatchTime).next().getTime()
      if (nextInterval - now < timeDiff) {
        nextTick = schedule.dispatchTime
        timeDiff = nextInterval - now
      }
    })
    return nextTick === '' ? undefined : nextTick
  }
}
