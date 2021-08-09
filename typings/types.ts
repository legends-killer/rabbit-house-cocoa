import { Context } from 'egg'
import { IncomingMessage } from 'http'
interface mqttReq extends IncomingMessage {
  topic?: string
  msg?: any
  message?: any
}
export interface IPluginContext extends Context {
  req: mqttReq
}
