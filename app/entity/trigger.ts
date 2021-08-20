import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Trigger {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  deviceId: number // trigger所属设备id

  @Column()
  topic: string // device中的设备支持订阅的topic

  @Column()
  scheduleId: number // 对应调起schedule表的一组任务

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

export default Trigger
