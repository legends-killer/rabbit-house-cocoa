import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1628153884425_2807'

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
  // mqtt
  config.emqtt = {
    client: {
      host: 'mqtt://127.0.0.1',
      username: 'user',
      password: '123456',
      clientId: 'egg',
      options: {
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false,
      },
      msgMiddleware: ['msg2json'],
    },
  }
  // mqtt server
  config.rabbitHouseMqttPlugin = {
    port: 1883,
    username: 'user',
    password: '123456',
  }

  // add your egg config in here
  config.middleware = []

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  }
}
