import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import { join } from 'path'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628153884425_2807'

  // schedule nextTick cron
  config.nextTick = ''

  // jwt config
  config.jwt = {
    secret: 'your_jwt_secret',
  }

  // add your egg config in here
  config.middleware = ['errorHandler', 'tokenHandler']
  config.errorHandler = {
    match: ['/api'],
  }
  config.tokenHandler = {
    ignore: ['/api/refreshToken'],
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
