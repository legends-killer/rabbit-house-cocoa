import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
// 定时任务
@Entity()
class Schedule {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column()
  triggerId: number // 触发器id

  @Column()
  dispatchTime: string // 触发时间

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
