import { Service } from 'egg'
import Device from '../entity/device'
import { IsNull } from 'typeorm'

/**
 * device service
 * to perform operations on device info
 */
export default class DeviceService extends Service {
  /**
   * @param {Object} params formated params
   */
  async index(params: { id?: number; clientName?: string; active?: boolean }) {
    const db = this.ctx.repo
    const devices = db.Device.createQueryBuilder()
    devices.where('deletedAt Is NULL')
    devices.andWhere('active = :active', { active: params.active })
    if (params.id) devices.andWhere('id = :id', { id: params.id })
    if (params.clientName) devices.andWhere('clientName LIKE :clientName', { clientName: '%' + params.clientName + '%' })
    devices.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await devices.getManyAndCount()
  }

  async create(device: Device) {
    const db = this.ctx.repo
    return await db.Device.save(device)
  }

  async update(id: number, newDevice: Device) {
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Device.findOne({ id })
    newDevice = { ...rawWillBeUpdated, ...newDevice, updatedAt: new Date() }
    return await db.Device.update(id, newDevice)
  }

  async destroy(id: number) {
    // soft delete
    console.log('id', id)
    const db = this.ctx.repo
    const rawWillBeUpdated = await db.Device.findOne({ id })
    const deletedDevice = { ...rawWillBeUpdated, deletedAt: new Date() } as Device
    return await db.Device.update(id, deletedDevice)
  }
}
