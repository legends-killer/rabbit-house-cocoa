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

  async refreshMqttListener() {
    const mClient = this.app.mqttClient
    const originTopics = Object.keys((mClient as any)._resubscribeTopics)
    const devices = (await this.service.device.index({ active: true }))[0]
    let allTopics: string[] = []
    const allDeviceConnections: string[] = []

    devices.forEach((device: Device) => {
      allDeviceConnections.push(device.connectionName)
      allTopics = Array.from(new Set([...allTopics, ...device.topic])) // 理论上不可能有重复
      Object.keys(device.api).forEach((key) => {
        const api = device.api[key]
        allTopics.push(api.topic + '/done')
      })
    })

    try {
      mClient.unsubscribe(originTopics)
      mClient.route(allTopics)
      this.app.mqttClient = mClient
    } catch (error) {
      console.error(error)
      this.ctx.throw(500)
    }
    return true
    // mClient.route(topics.flat(), this.app.controller.mqtt.mqtt.index)
  }
}
