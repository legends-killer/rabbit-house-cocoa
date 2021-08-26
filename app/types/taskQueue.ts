import { IJobWork } from './job'
export interface ITaskQueue {
  status: 'pending' | 'running' | 'completed'
  jobPointer: number | undefined
  jobs: IJobWork[]
}
