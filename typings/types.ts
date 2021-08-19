import { Context } from 'egg'
import { IncomingMessage } from 'http'
interface mqttReq extends IncomingMessage {
  topic: string
  msg: any
  message: any
}
export interface IPluginContext extends Context {
  req: mqttReq
}
export interface IBody {
  data: any
  code: number
  error: any
  msg?: string
}
