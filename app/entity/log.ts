import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Log {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  level: 'info' | 'warn' | 'error'

  @Column()
  domain: string

  @Column()
  msg: string

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
export default Log
