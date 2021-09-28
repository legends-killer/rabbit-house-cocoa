import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router, io, mqttClient } = app

  // system basics
  router.post('/api/refreshToken', controller.user.refreshToken)

  // log
  router.get('/api/log', controller.log.index)
  router.delete('/api/log', controller.log.destroy)

  // mqtt server
  router.post('/api/dispatch', controller.dispatcher.index)
  router.post('/api/refreshMqttTopic', controller.setting.refreshMqttTopic)
  router.post('/api/restartMqttServer', controller.setting.restartMqttServer)

  // standard RESTful API
  router.resources('device', '/api/device', controller.device)
  router.resources('trigger', '/api/trigger', controller.trigger)
  router.resources('job', '/api/job', controller.job)
  router.resources('schedule', '/api/schedule', controller.schedule)
  router.resources('user', '/api/user', controller.user)
  router.resources('setting', '/api/setting', controller.setting)
}
