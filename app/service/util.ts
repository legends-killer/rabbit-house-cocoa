import { Service } from 'egg'

export default class UtilService extends Service {
  filter(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === '' || obj[key] === null) {
        delete obj[key]
      }
    })
    return obj
  }
}
