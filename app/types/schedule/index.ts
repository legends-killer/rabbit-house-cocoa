/**
 * 定时任务内容定义
 * 本质就是调设备api，发布mqtt包
 * @see https://eggjs.org/zh-cn/basics/schedule.html#定时方式 定时方式为corn
 */
export interface IScheduleWork {
  name: string
  description?: string
  starttime?: string // 定时任务时间
  asynchronized: boolean // 异步执行？默认同步
  // 该任务调用的api
  works: Array<workItem | number> // 如果为number则对应另一个scheduleId
}

interface workItem {
  waitBefore: number
  apiName: string
  args: {
    [index: string]: any
  }
}
