import { Controller } from 'egg'
import { IBody } from '../../typings/types'

export default class DispatcherController extends Controller {
  async index() {
    const { ctx } = this
    const { jobId } = ctx.request.body
    const body = {} as IBody
    const jobQueue = await ctx.service.mqtt.job.assembleJob(jobId)
    const queueId = await ctx.service.taskQueue.queue.create(jobQueue)
    console.log(queueId)
    await ctx.service.taskQueue.dispatcher.dispatch(queueId)

    body.code = 200
    body.error = 0
    body.msg = 'job started successfully'
    body.data = {}
    ctx.body = body
  }
}
