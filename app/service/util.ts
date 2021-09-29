import { Service } from 'egg'
import Device from '../entity/device'

export default class UtilService extends Service {
  filter(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === '' || obj[key] === null) {
        delete obj[key]
      }
    })
    return obj
  }

  /**
   * find out difference between before and after
   * @param before array
   * @param after array
   * @return {Array} item will be delete, item will be added
   */
  diff(before: Array<any>, after: Array<any>): Array<any> {
    return [before.filter((x) => !after.includes(x)), after.filter((x) => !before.includes(x))]
  }

  async refreshMqttListener() {
    const mClient = this.app.mqttClient
    const originTopics = Object.keys((mClient as any)._resubscribeTopics)
    const originConnections = await this.service.tool.redis.getAllKey('device')

    const devices = (await this.service.device.index({ active: true }))[0]
    let allTopics: string[] = []
    const allDeviceConnections: string[] = ['egg']

    devices.forEach((device: Device) => {
      allDeviceConnections.push(device.connectionName)
      allTopics = Array.from(new Set([...allTopics, ...device.topic])) // 理论上不可能有重复
      Object.keys(device.api).forEach((key) => {
        const api = device.api[key]
        allTopics.push(api.topic + '/done')
      })
    })

    const [delTopics, newTopics] = this.diff(originTopics, allTopics)
    const [delConnections, newConnections] = this.diff(originConnections, allDeviceConnections)

    try {
      mClient.unsubscribe(delTopics)
      mClient.route(newTopics)
      await Promise.all([
        ...delConnections.map((connectionName: string) => {
          return this.service.tool.redis.delete('device', connectionName)
        }),
        ...newConnections.map((connectionName: string) => {
          return this.service.taskQueue.device.update(connectionName, false, false, [])
        }),
      ])
      this.app.mqttClient = mClient
    } catch (error) {
      console.error(error)
      this.ctx.throw(500)
    }
    return true
    // mClient.route(topics.flat(), this.app.controller.mqtt.mqtt.index)
  }
}
