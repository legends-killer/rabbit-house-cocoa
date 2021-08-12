import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 启动服务器时，初始化配置
 */
@Entity()
class InitConfig {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public key: string

  @Column({ nullable: true })
  public value: string

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date

  @Column('datetime', {
    nullable: true,
  })
  deletedAt: Date
}

export default InitConfig
