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
  return config
}
