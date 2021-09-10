import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import { join } from 'path'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628153884425_2807'

  // schedule nextTick cron
  config.nextTick = ''

  // mqtt
  config.rabbitHouseMqttPlugin = {
    server: {
      host: '192.168.249.132',
      port: 1883,
      username: 'user',
      password: '123456',
    },
    client: {
      host: '192.168.249.132',
      clientId: 'egg',
      username: 'user',
      password: '123456',
      protocol: 'mqtt',
      msgMiddleware: ['msg2json'],
      options: {
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false,
      },
    },
  }

  // add your egg config in here
  config.middleware = ['errorHandler']
  config.errorHandler = {
    match: ['/api'],
  }

  // taskQueue logger
  config.customLogger = {
    taskLogger: {
      file: join(appInfo.root, 'logs/task.log'),
    },
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
  }
}
