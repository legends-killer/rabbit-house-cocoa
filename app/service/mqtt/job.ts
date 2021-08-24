import { Service } from 'egg'
import { IScheduleWork } from '../../types'

export default class JobService extends Service {
  /**
   * 递归拼装一组job
   * @param {number} scheduleId scheduleId
   * @return {Array<IScheduleWork>} schedule work array
   */
  async assembleJob(scheduleId: number) {
    const jobs = await this.service.schedule.index({ id: scheduleId })
    if (jobs[1] === 0) this.ctx.logger.error(`Job Not Found, id: ${scheduleId}`)
    const result = [] as Array<IScheduleWork>
    for (const work of jobs[0][0].work) {
      if (typeof work === 'number') {
        result.push(...(await this.assembleJob(work)))
      } else {
        result.push(work)
      }
    }
    return result
  }
}
