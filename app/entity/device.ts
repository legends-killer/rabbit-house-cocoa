import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IDeviceApi } from '../types'

const TransApi = {
  from: (value: string) => {
    return JSON.parse(value) as IDeviceApi
  },
  to: (value: IDeviceApi | undefined) => {
    if (value === undefined) return ''
    return JSON.stringify(value)
  },
}
const TransStringArray = {
  from: (value: string) => {
    if (value === undefined) return ''
    return value.split(',')
  },
  to: (value: Array<string> | undefined) => {
    if (value === undefined) return ''
    return value.toString()
  },
}

// 连接设备信息表实体
@Entity()
class Device {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public clientName: string // 设备名称

  @Column({ nullable: true })
  public description: string // 设备描述

  @Column()
  public connectionName: string // 设备mqtt客户端连接名

  @Column({ default: () => true })
  public active: boolean // 设备是否激活

  @Column('varchar', { transformer: TransApi })
  public api: IDeviceApi // 设备支持的api

  @Column('varchar', { transformer: TransStringArray })
  public receiveMiddleware: string[] // 设备发送消息后，经过的中间件

  @Column('varchar', { transformer: TransStringArray })
  public topic: string[] // 设备支持订阅的topic

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date

  @Column('datetime', {
    nullable: true,
  })
  deletedAt: Date
}

export default Device
