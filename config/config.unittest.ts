import { EggAppConfig, PowerPartial } from 'egg'
import { join } from 'path'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  const isInnerIp = function (ip: any) {
    console.log(ip)
    return true
  }
  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: (ctx: any) => isInnerIp(ctx.ip),
    },
  }
  config.typeorm = {
    client: {
      type: 'better-sqlite3',
      database: join(__dirname, '../db/rabbit-house.db'),
      statementCacheSize: 100,
      synchronize: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      prepareDatabase: () => {},
    },
  }
  config.rabbitHouseMqttPlugin = {
    server: {
      host: '127.0.0.1',
      port: 1883,
      username: 'user',
      password: '123456',
    },
    client: {
      host: '127.0.0.1',
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
  return config
}
