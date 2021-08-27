/**
 * 设备状态
 * 设备是否锁住
 * 设备是否离线
 */
import { Service } from 'egg'
import { IDeviceStatus } from '../../types'

export default class DeviceService extends Service {
  async index(connectionName: string) {
    return JSON.parse((await this.ctx.service.tool.redis.get('device', connectionName)) || '{}') as IDeviceStatus
  }

  async update(connectionName: string, online?: boolean, locked?: boolean) {
    const statusWillUpdate = await this.index(connectionName)
    if (typeof online === 'boolean') statusWillUpdate.online = online
    if (typeof locked === 'boolean') statusWillUpdate.locked = locked
    return await this.ctx.service.tool.redis.set('device', connectionName, statusWillUpdate)
  }
}
