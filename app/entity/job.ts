import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
import { IJobWork } from '../types'

const TransWork = {
  from: (value: string) => {
    return JSON.parse(value) as Array<IJobWork | number>
  },
  to: (value: Array<IJobWork | number>) => {
    return JSON.stringify(value)
  },
}
// 任务实体
@Entity()
class Job {
  @PrimaryGeneratedColumn()
  public id: number

  @Index({ unique: true })
  @Column()
  public name: string // 任务名称

  @Column({ nullable: true })
  public description: string // 任务描述

  @Column({ default: () => true })
  public sendResult: boolean // 是否发送执行结果通知

  @Column({ nullable: true })
  public waitBefore: number // 执行等待时间

  @Column('varchar', { transformer: TransWork })
  public work: Array<IJobWork | number> // JSON 对象数组，定时任务内容

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

export default Job
