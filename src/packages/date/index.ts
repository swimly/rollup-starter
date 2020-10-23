import defaultTpl from './temp/index.ejs'

import Utils from "src/utils"
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'

// import Utils from '../../utils/index'
interface Option {
  id: string,
  range: boolean
  value: Array<string>,
  data?: Array<Array<Array<Days>>>,
  weeks: Array<string>
}
interface Days {
  year?:number,
  month?:number,
  day?:number,
  isMonth?:boolean,
  weekday?:number
}
export default class LCDate {
  static option:Option = {
    id: '',
    range: false,
    value: [format(new Date(), 'yyyy/MM/dd')],
    weeks: ['一','二','三','四','五','六','日']
  }
  constructor (option:Option) {
    LCDate.render(option)
  }
  // 初始化
  static render (option: Option):void {
    let opt:Option = Object.assign({}, this.option, option)
    // 如果range为true，自动获取下个月份的日期
    opt = this.initArray(opt)
    const dom = this.renderDom(opt)
    // 创建一个div
    const divDom = document.createElement('div')
    divDom.appendChild(dom)
    // divDom.style.position = 'absolute'
    document.body.appendChild(divDom)
    this.bindClick(opt, divDom)
  }
  // 渲染html
  static renderDom (opt:Option):Node {
    const html = defaultTpl(opt)
    const dom = Utils.parseToDom(html)[0]
    return dom
  }
  static bindClick (opt: Option, dom: Node):void {
    const ele = dom as Element
    ele.querySelector('.next-month')?.addEventListener('click', () => {
      this.onNextMonth(opt, dom)
    })
    ele.querySelector('.prev-month')?.addEventListener('click', () => {
      this.onPrevMonth(opt, dom)
    })
  }
  // 切换到下个月
  static onNextMonth(opt:Option, dom: Node):void {
    const option = this.changeMonth(opt, 1)
    const d = this.renderDom(option)
    console.log(d, dom)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  // 切换到上个月
  static onPrevMonth(opt:Option, dom: Node):void {
    const option = this.changeMonth(opt, -1)
    const d = this.renderDom(option)
    console.log(d, dom)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  // 改变月份，改变option
  static changeMonth (opt:Option, con: number):Option {
    opt.value = [format(addMonths(new Date(opt.value[0]), con), 'yyyy/MM/dd')]
    opt.data = [Utils.getMonthDaysArray(opt.value[0])]
    if (opt.range){
      const next: string = format(addMonths(new Date(opt.value[0]), 1), 'yyyy/MM/dd')
      opt.value = opt.value.concat(next)
      opt.data = opt.data.concat([Utils.getMonthDaysArray(next)])
    }
    return opt
  }
  /*
    生成数组
  */
  static initArray (opt:Option): Option {
    const option:Option = opt
    option.data = [Utils.getMonthDaysArray(opt.value[0])]
    if (option.range) {
      const next: string = format(addMonths(new Date(), 1), 'yyyy/MM/dd')
      option.value = option.value.concat([next])
      option.data = option.data.concat([Utils.getMonthDaysArray(next)])
    }
    console.log(option)
    return option
  }
}