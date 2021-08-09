import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/', controller.home.index)
  app.mqttClient.route(['text', 'aaa', 'bbb'], controller.mqtt.mqtt.index)
}
