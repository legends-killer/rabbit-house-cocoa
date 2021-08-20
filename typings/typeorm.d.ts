// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityDevice from '../app/entity/device'
import EntityInit from '../app/entity/init'
import EntityRedis from '../app/entity/redis'
import EntitySchedule from '../app/entity/schedule'
import EntityTrigger from '../app/entity/trigger'

declare module 'egg' {
  interface Context {
    entity: {
      Device: typeof EntityDevice
      Init: typeof EntityInit
      Redis: typeof EntityRedis
      Schedule: typeof EntitySchedule
      Trigger: typeof EntityTrigger
    }
    repo: {
      Device: Repository<EntityDevice>
      Init: Repository<EntityInit>
      Redis: Repository<EntityRedis>
      Schedule: Repository<EntitySchedule>
      Trigger: Repository<EntityTrigger>
    }
  }
}
