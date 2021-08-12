import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  rabbitHouseMqttPlugin: { enable: true, package: 'egg-rabbit-house-mqtt-plugin' },
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
}

export default plugin
