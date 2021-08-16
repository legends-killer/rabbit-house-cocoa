import { EggAppConfig, PowerPartial } from 'egg'
import { join } from 'path'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
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
  return config
}
