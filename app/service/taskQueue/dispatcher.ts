/**
 * 任务调度器
 * 负责任务队列的调度，执行，中断
 * 控制任务状态的维护
 * 重试机制
 */
import { Service } from 'egg'

export default class DispatchService extends Service {
  async dispatch() {} // 新触发一个任务

  async tryNext() {} // 尝试下一步

  async setStatus() {} // 设置队列状态

  async retry() {} // 重试任务
}
