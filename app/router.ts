import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router, io, mqttClient } = app

  router.get('/', controller.home.index)
  router.resources('device', '/api/device', controller.device)
  router.resources('trigger', '/api/trigger', controller.trigger)
}
