import { Application } from 'egg'
import * as path from 'path'
import Device from './app/entity/device'
import Log from './app/entity/log'

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
    const service = this.app.createAnonymousContext().service
    const mClient = this.app.mqttClient
    const mServer = this.app.mqttServer.aedes

    // 订阅所有IoT设备的topic，在controller中处理消息队列和缓存机制
    mClient.route(this.appBootCache.topics)
    mClient.handle(this.app.controller.mqtt.mqtt.index)

    /**
     * 维护设备状态
     */
    // init
    await Promise.all(
      this.appBootCache.deviceConnections.map((device: string) => {
        return service.taskQueue.device.update(device, false, false, [])
      })
    )
    // 设备连接
    mServer.on('client', async (client) => {
      const log = {} as Log
      log.domain = 'device'
      log.level = 'info'
      log.msg = `device connected, connection id is ${client.id}`
      await Promise.all([service.taskQueue.device.update(client.id, true, false), service.log.create(log)])
    })
    // 设备断开
    mServer.on('clientDisconnect', async (client) => {
      const log = {} as Log
      log.domain = 'device'
      log.level = 'warn'
      log.msg = `device disconnected, connection id is ${client.id}`
      Promise.all([service.taskQueue.device.update(client.id, false, false), service.log.create(log)])
    })

    // 设置自定义定时任务触发
    this.app.config.nextTick = await service.schedule.getNextTick()

    // 添加默认用户 admin
    const allUser = (await service.user.index({}))[0]
    let hasAdmin = false
    for (const user of allUser) {
      if (user.username === 'admin') {
        hasAdmin = true
        break
      }
    }
    if (!hasAdmin) {
      const admin = await service.user.create({ username: 'admin' } as any)
      if (admin.token) {
        console.log('----------------')
        console.log(`default admin created, please save your token: \x1B[31m${admin.token}\x1B[0m`)
        console.log('----------------')
      }
    }
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
              if (key2 === 'args' && api[key2] instanceof Array) {
                argsOk = true
              }
            })
            if (!(topicOk && argsOk)) {
              throw new Error(topicOk ? (argsOk ? '' : 'api args must be array') : 'api topic must be string')
            }
          })
        }
      } catch (err) {
        return (err as any).message
      }
    })
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    if (this.app.config.env !== 'prod') {
      setInterval(() => {
        this.memCheck()
      }, 10000)
    }
  }
  memCheck() {
    const used = process.memoryUsage()
    console.log('--------------')
    for (const key in used) {
      console.log(`${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`)
    }
    console.log('--------------')
  }
}

module.exports = AppBootHook
