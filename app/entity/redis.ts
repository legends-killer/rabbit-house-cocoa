import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

const TransValue = {
  from: (value: string) => {
    return JSON.parse(value) as any
  },
  to: (value: any) => {
    return JSON.stringify(value)
  },
}

@Entity()
class Redis {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: string

  @Column('varchar', { transformer: TransValue })
  value: any

  @Column()
  CreatedAt: Date

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  PersistedAt: Date
}

export default Redis
