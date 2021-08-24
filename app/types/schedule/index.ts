/**
 * 定时任务内容定义
 * 本质就是调设备api，发布mqtt包
 * @see https://eggjs.org/zh-cn/basics/schedule.html#定时方式 定时方式为corn
 */
export interface IScheduleWork {
  // [index: number]: workItem | number // number则对应另一个scheduleId
  waitBefore: number
  apiTopic: string
  args: string[]
}
