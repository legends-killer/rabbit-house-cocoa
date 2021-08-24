import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IScheduleWork } from '../types'

const TransWork = {
  from: (value: string) => {
    return JSON.parse(value) as Array<IScheduleWork | number>
  },
  to: (value: Array<IScheduleWork | number>) => {
    return JSON.stringify(value)
  },
}
// 定时任务表实体
@Entity()
class Schedule {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string // 定时任务名称

  @Column({ nullable: true })
  public description: string // 定时任务描述

  @Column({ default: () => true })
  public sendResult: boolean // 是否发送执行结果通知

  @Column({ nullable: true })
  public waitBefore: number // 执行等待时间

  @Column('varchar', { transformer: TransWork })
  public work: Array<IScheduleWork | number> // JSON 对象数组，定时任务内容

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

export default Schedule
