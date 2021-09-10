import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      cron: app.config.nextTick, // dispath user schedule dynamically
      type: 'worker',
      immediate: true,
    },
    async task(ctx: Context) {
      const works = (await ctx.service.schedule.index({}))[0]
        .map((work) => {
          return work.dispatchTime === app.config.nextTick ? work : undefined
        })
        .filter((work) => {
          return work !== undefined
        })

      let jobId = [] as Array<number>
      for (const work of works) {
        const trigger = (await ctx.service.trigger.index({ id: work!.triggerId }))[0][0]
        if (trigger) {
          jobId.push(...trigger.jobId)
        }
      }
      jobId = Array.from(new Set(jobId))

      const func = [] as Array<Promise<any>>
      for (const id of jobId) {
        const jobQueue = await ctx.service.mqtt.job.assembleJob(id)
        const queueId = await ctx.service.taskQueue.queue.create(id, jobQueue)

        func.push(Promise.resolve(ctx.service.taskQueue.dispatcher.dispatch(queueId)))
      }

      if (func.length > 0) {
        Promise.all(func)
          .then(async () => {
            app.config.nextTick = await ctx.service.schedule.getNextTick()
          })
          .catch((e) => {
            ctx.logger.error(e)
          })
      }
    },
  }
}
