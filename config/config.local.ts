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
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
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
  config.redis = {
    // client: {
    //   port: 6379,
    //   host: '192.168.137.30',
    //   password: '123456',
    //   db: 0,
    // },
    clients: {
      mqtt: {
        port: 6379,
        host: '192.168.137.30',
        password: '123456',
        db: 0,
      },
      job: {
        port: 6379,
        host: '192.168.137.30',
        password: '123456',
        db: 1,
      },
      device: {
        port: 6379,
        host: '192.168.137.30',
        password: '123456',
        db: 2,
      },
      sys: {
        port: 6379,
        host: '192.168.137.30',
        password: '123456',
        db: 3,
      },
    },
  }
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/stream': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  }
  return config
}
