// This file is created by egg-ts-helper@1.27.0
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityDevice from '../app/entity/device'
import EntityInit from '../app/entity/init'
import EntityJob from '../app/entity/job'
import EntityLog from '../app/entity/log'
import EntityRedis from '../app/entity/redis'
import EntitySchedule from '../app/entity/schedule'
import EntityTrigger from '../app/entity/trigger'
import EntityUser from '../app/entity/user'

declare module 'egg' {
  interface Context {
    entity: {
      Device: typeof EntityDevice
      Init: typeof EntityInit
      Job: typeof EntityJob
      Log: typeof EntityLog
      Redis: typeof EntityRedis
      Schedule: typeof EntitySchedule
      Trigger: typeof EntityTrigger
      User: typeof EntityUser
    }
    repo: {
      Device: Repository<EntityDevice>
      Init: Repository<EntityInit>
      Job: Repository<EntityJob>
      Log: Repository<EntityLog>
      Redis: Repository<EntityRedis>
      Schedule: Repository<EntitySchedule>
      Trigger: Repository<EntityTrigger>
      User: Repository<EntityUser>
    }
  }
}
