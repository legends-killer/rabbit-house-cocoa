import { IJobWork } from './job'
export interface ITaskQueue {
  mainJobId: number
  status: 'pending' | 'running' | 'completed'
  jobPointer: number
  jobs: IJobWork[]
  execLog: ITaskQueueExecLog[]
}

export interface ITaskQueueExecLog {
  msg: string
  level: 'info' | 'warn' | 'error'
  domain: string
}
