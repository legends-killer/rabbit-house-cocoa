import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router, io, mqttClient } = app

  router.get('/', controller.home.index)
  router.post('/api/refreshToken', controller.user.refreshToken)
  router.post('/api/dispatch', controller.dispatcher.index)
  router.get('/api/log', controller.log.index)
  router.delete('/api/log', controller.log.destroy)
  router.resources('device', '/api/device', controller.device)
  router.resources('trigger', '/api/trigger', controller.trigger)
  router.resources('job', '/api/job', controller.job)
  router.resources('schedule', '/api/schedule', controller.schedule)
  router.resources('user', '/api/user', controller.user)
}
