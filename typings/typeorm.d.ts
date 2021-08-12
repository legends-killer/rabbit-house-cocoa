// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityDevice from '../app/entity/device'
import EntityInit from '../app/entity/init'
import EntitySchedule from '../app/entity/schedule'

declare module 'egg' {
  interface Context {
    entity: {
      Device: typeof EntityDevice
      Init: typeof EntityInit
      Schedule: typeof EntitySchedule
    }
    repo: {
      Device: Repository<EntityDevice>
      Init: Repository<EntityInit>
      Schedule: Repository<EntitySchedule>
    }
  }
}
