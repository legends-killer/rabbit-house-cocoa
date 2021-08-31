import { Subscription } from 'egg'

export default class PersistRedis extends Subscription {
  static get schedule() {
    return {
      cron: '0 */1 * * * *', // check task queue every minute
      type: 'worker',
      immediate: true,
    }
  }
  async subscribe() {
    const { ctx } = this
    const executionQueue = await ctx.service.taskQueue.monitor.index()
    executionQueue.forEach((task) => {
      console.log(task)
      if (new Date().getTime() - new Date(task.timeOnRedis!).getTime() > 300) {
        // 默认5分钟任务超时，手动触发任务完成并附加错误信息
        console.log('timeout')
        ctx.service.taskQueue.monitor.pop(task.uuid)
        ctx.app.mqttClient.publish(
          task.apiTopic + '/done',
          JSON.stringify({
            success: false,
            uuid: task.uuid,
            device: task.connectionName,
            error: `device response time out at topic: ${task.apiTopic}`,
          })
        )
      }
    })
  }
}
