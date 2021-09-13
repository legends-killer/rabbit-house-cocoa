import { IJobWork } from './job'
export interface ITaskQueue {
  mainJobId: number
  status: 'pending' | 'running' | 'completed' | 'exit'
  jobPointer: number
  jobs: IJobWork[]
  maxRetryAttempts: number
  execLog: ITaskQueueExecLog[]
}

export interface ITaskQueueExecLog {
  msg: string
  level: 'info' | 'warn' | 'error'
  domain: string
}
