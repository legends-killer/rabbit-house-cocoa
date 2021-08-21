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
  config.redis = {
    // 单个数据库用client
    client: {
      port: 6379,
      host: '192.168.137.30',
      password: '123456',
      db: 0,
    },
    // 使用多个数据库连接
    // clients: {
    //   db0: {
    // 	port: 6379,
    // 	host: '127.0.0.1',
    // 	password: null,
    // 	db: 0,
    //   },
    //   db1: {
    // 	  port: 6379,
    // 	  host: '127.0.0.1',
    // 	  password: null,
    // 	  db: 1,
    //   }
    // }
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
  // job queue
  config.bus = {
    debug: true, // Debug 模式下会打印更多日志信息
    concurrency: 1, // Bull 中队列处理的并发数：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueprocess
    listener: {
      ignore: null, // 忽略目录中的某些文件，https://eggjs.org/zh-cn/advanced/loader.html#ignore-string
      baseDir: 'listener',
      options: {
        // Bull Job 配置： https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
        attempts: 5,
        backoff: {
          delay: 3000,
          type: 'fixed',
        },
      },
    },
    job: {
      // 与 listener 一致，唯一不同的就是 默认 baseDir 的值为 `job`
    },
    bull: {
      // Bull 队列配置：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queue
      redis: {
        host: '192.168.137.30',
        port: 6379,
        db: 0,
      },
    },

    queue: {
      default: 'default', // 默认队列名称
      prefix: 'bus', // 队列前缀
    },
    queues: {
      // 针对不同队列单独配置

      // 比如针对默认队列更改 redis 端口
      default: {
        redis: {
          port: 6380,
        },
      },
    },
  }
  return config
}
