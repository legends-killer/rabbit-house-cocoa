import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
const TransNumberArray = {
  from: (value: string) => {
    if (value === undefined) return ''
    return value.split(',').map((t) => {
      return Number(t)
    })
  },
  to: (value: Array<number> | undefined) => {
    if (value === undefined) return ''
    return value.toString()
  },
}

@Entity()
class Trigger {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  deviceId: number // trigger所属设备id

  @Column('varchar', { transformer: TransNumberArray })
  JobId: number[] // 对应调起job表的任务

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
