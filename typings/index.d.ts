import 'egg'
import {IncomingMessage} from 'http'
declare module 'egg' {
  interface Application {
    mqtt: any
  }
}
