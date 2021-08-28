/**
 * 定时任务内容定义
 * 本质就是调设备api，发布mqtt包
 * @see https://eggjs.org/zh-cn/basics/schedule.html#定时方式 定时方式为corn
 */
export interface IJobWork {
  waitBefore: number
  apiTopic: string
  connectionName: string // 用connectionName代表device
  name?: string
  args: {
    [index: string]: any
  }
}
