import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  // emqtt: { enable: true, package: 'egg-emqtt' },
  // cors: {
  //   enable: true,
  //   package: 'egg-cors',
  // },
  rabbitHouseMqttPlugin: { enable: true, package: 'egg-rabbit-house-mqtt-plugin' },
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
}

export default plugin
