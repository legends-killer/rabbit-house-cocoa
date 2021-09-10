import { Service } from 'egg'
import { IJobWork, ITaskQueue } from '../../types'

export default class JobService extends Service {
  /**
   * 递归拼装一组job
   * @param {number} jobId jobId
   * @return {Array<IScheduleWork>} schedule work array
   */
  async assembleJob(jobId: number, ids: number[] = []) {
    ids.push(jobId)
    const jobs = await this.service.job.index({ id: jobId })
    if (jobs[1] === 0) this.ctx.logger.error(`Job Not Found, id: ${jobId}`)
    const result = [] as Array<IJobWork>
    for (const work of jobs[0][0].work) {
      if (typeof work === 'number') {
        if (!ids.includes(work)) result.push(...(await this.assembleJob(work, ids)))
      } else {
        result.push(work)
      }
    }
    return result
  }

  isFinished(queue: ITaskQueue) {
    return queue.jobs.length === queue.jobPointer + 1
  }
}
