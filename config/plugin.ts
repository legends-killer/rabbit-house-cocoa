import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  rabbitHouseMqttPlugin: { enable: true, package: 'egg-rabbit-house-mqtt-plugin' },
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
}

export default plugin
