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
/**
 * 设备状态定义
 */
export interface IDeviceStatus {
  online: boolean
  locked: boolean
}
