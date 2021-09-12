import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

const transGroup = {
  from: (value: string) => {
    return value.split(',').map((m) => {
      return Number(m)
    })
  },
  to: (value: number[] | undefined) => {
    if (value === undefined) return ''
    return value.toString()
  },
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  token: string

  @Column('datetime')
  tokenExp: Date

  @Column('varchar', { transformer: transGroup })
  group: number[]

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

export default User
