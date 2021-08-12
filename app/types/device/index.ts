/**
 * 设备api接口定义
 * @key index:string api name
 * @value Object api对象
 */
export interface IDeviceApi {
  [index: string]: {
    topic: string // mqtt topic
    description?: string
    args: {
      [index: string]: any
    }
  }
}
