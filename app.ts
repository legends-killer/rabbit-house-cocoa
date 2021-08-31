import { Application } from 'egg'
import * as path from 'path'
import Device from './app/entity/device'

// app.js
/**
 * @see https://user-images.githubusercontent.com/40081831/47344271-a688d500-d6da-11e8-96e9-663fa9f45108.png 应用加载逻辑
 */
class AppBootHook {
  private readonly app: Application
  private appBootCache: { [key: string]: any }
  constructor(app: Application) {
    this.app = app
    this.appBootCache = {}
  }

  configWillLoad() {
    const directory = path.join(this.app.config.baseDir, 'app', 'mqtt')
    this.app.loader.loadToApp(directory, 'mqtt')
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    // 例如：创建自定义应用的示例
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存
    // get mqtt topics from db
    // get all devices
    const repo = this.app.context.repo
    const devices = (await repo.Device.find()) as Device[]
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
    this.appBootCache.topics = allTopics
    this.appBootCache.deviceConnections = allDeviceConnections
  }

  async didReady() {
    // 应用已经启动完毕
    // 订阅所有IoT设备的topic，在controller中处理消息队列和缓存机制
    const mClient = this.app.mqttClient
    // todo: refactor to use individual qos for each toipc
    mClient.route(this.appBootCache.topics, this.app.controller.mqtt.mqtt.index)
    // 设置设备初始化状态
    this.appBootCache.deviceConnections.forEach(async (connectionName: string) => {
      const initState = JSON.stringify({
        online: true,
        locked: false,
        pendingQueue: [],
      })
      await this.app.redis.get('device').set(connectionName, initState)
    })
  }

  async serverDidReady() {
    // 添加自定义校验规则
    this.app.validator.addRule('deviceApi', (rule, value) => {
      try {
        if (value !== undefined) {
          Object.keys(value).forEach((key1) => {
            // key1 -> apiName
            let topicOk = false
            let argsOk = false
            const api = value[key1]
            Object.keys(api).forEach((key2) => {
              // key2 -> must be topic or args
              if (key2 === 'topic' && typeof api[key2] === 'string' && api[key2] !== '') {
                topicOk = true
              }
              if (key2 === 'args' && api[key2] instanceof Array && api[key2].length > 0) {
                argsOk = true
              }
            })
            if (!(topicOk && argsOk)) {
              throw new Error(topicOk ? (argsOk ? '' : 'api args must be non-empty array') : 'api topic must be string')
            }
          })
        }
      } catch (err) {
        return err.message
      }
    })
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }
}

module.exports = AppBootHook
