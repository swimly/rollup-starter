// import tpl from './temp/index.ejs'
interface Option {
  id?: string
}
export default class LCDate {
  static option:Option = {
    id: ''
  }
  constructor (option:Option) {
    LCDate.init(option)
  }
  static init (option: Option):void {
    this.option = Object.assign({}, this.option, option)
    console.log(this.option)
  }
}