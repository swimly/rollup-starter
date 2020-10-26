import defaultTpl from './temp/index.ejs'
import yearTpl from './temp/year.ejs'
import monthTpl from './temp/month.ejs'
import timeTpl from './temp/time.ejs'

import Utils from "src/utils"
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'

// import Utils from '../../utils/index'
interface Option {
  id: string,
  range: boolean
  value: Array<string>,
  data?: Array<Array<Array<Days>>>,
  weeks: Array<string>,
  type?: string,
  years: Array<Array<number>>,
  months?: Array<Array<string>>,
  times: Array<Array<Array<number>>>
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
    weeks: ['一','二','三','四','五','六','日'],
    type: 'date',
    years: [[]],
    times: [[[]]]
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
    let html
    if (opt.type == 'date') {
      html = defaultTpl(opt)
    } else if (opt.type == 'year') {
      html = yearTpl(opt)
    } else if (opt.type == 'yearmonth') {
      html = monthTpl(opt)
    } else if (opt.type == 'time') {
      html = timeTpl(opt)
    }
    const dom = Utils.parseToDom(html)[0]
    return dom
  }
  static bindClick (opt: Option, dom: Node):void {
    const ele = dom as Element
    // 下个月
    ele.querySelector('.next-month')?.addEventListener('click', () => {
      this.onNextMonth(opt, dom)
    })
    // 上个月
    ele.querySelector('.prev-month')?.addEventListener('click', () => {
      this.onPrevMonth(opt, dom)
    })
    // 上一年
    ele.querySelector('.prev-year')?.addEventListener('click', () => {
      this.onPrevYear(opt, dom)
    })
    // 下一年
    ele.querySelector('.next-year')?.addEventListener('click', () => {
      this.onNextYear(opt, dom)
    })
    const nextyears = ele.querySelectorAll('.next-years')
    nextyears.forEach((year, index) => {
      year.addEventListener('click', () => {
        this.onNextYears(opt, dom, index)
      })
    })
    const prevyears = ele.querySelectorAll('.prev-years')
    prevyears.forEach((year, index) => {
      year.addEventListener('click', () => {
        this.onPrevYears(opt, dom, index)
      })
    })
  }
  // 切换到下个月
  static onNextMonth(opt:Option, dom: Node):void {
    const option = this.changeMonth(opt, 1)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  // 切换到上个月
  static onPrevMonth(opt:Option, dom: Node):void {
    const option = this.changeMonth(opt, -1)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  // 切换到下一年
  static onNextYear(opt:Option, dom: Node):void {
    const option = this.changeYear(opt, 1)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  // 切换到上一年
  static onPrevYear(opt:Option, dom: Node):void {
    const option = this.changeYear(opt, -1)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  static onPrevYears (opt:Option, dom:Node, index:number):void {
    const option = this.changeYears(opt, -1, index)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  static onNextYears (opt:Option, dom:Node, index:number):void {
    const option = this.changeYears(opt, 1, index)
    const d = this.renderDom(option)
    dom.replaceChild(d, dom.childNodes[0])
    this.bindClick(opt, dom)
  }
  static changeYears (opt:Option, con:number, index:number):Option {
    const dateArr = opt.value[index].split('/')
    const year:number = parseInt(dateArr[0])
    const month:number = parseInt(dateArr[1])
    const day:number = parseInt(dateArr[2])
    const newyear = year + con
    const start = newyear - 7
    const end = newyear + 7
    opt.value[index] = `${newyear}/${month}/${day}`
    opt.years[index] = Array.from(new Array(end + 1).keys()).slice(start)
    return opt
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
  // 改变年份 逻辑有误，待修改
  static changeYear (opt:Option, con: number):Option {
    opt.value = [format(addYears(new Date(opt.value[0]), con), 'yyyy/MM/dd')]
    opt.data = [Utils.getMonthDaysArray(opt.value[0])]
    if (opt.range){
      const date = new Date(opt.value[0])
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      let nextStr
      if (month < 12) {
        nextStr = `${year}/${month + 1}/${day}`
      } else {
        nextStr = `${year + 1}/${1}/${day}`
      }
      const next: string = format(new Date(nextStr), 'yyyy/MM/dd')
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
    if (opt.type == 'date') {
      option.data = [Utils.getMonthDaysArray(opt.value[0])]
      if (option.range) {
        const next: string = format(addMonths(new Date(), 1), 'yyyy/MM/dd')
        option.value = option.value.concat([next])
        option.data = option.data.concat([Utils.getMonthDaysArray(next)])
      }
    } else if (opt.type == 'year') {
      const year:number = parseInt(opt.value[0].split('/')[0])
      const start:number = year - 7
      const end:number = year + 7
      option.years = [Array.from(new Array(end + 1).keys()).slice(start)]
      if (option.range) {
        const nextyear = year + 1
        const s = nextyear - 7
        const e = nextyear + 7
        const next = opt.value[0].split('/')
        option.value = option.value.concat([`${nextyear}/${next[1]}/${next[2]}`])
        const nextyears = [Array.from(new Array(e + 1).keys()).slice(s)]
        option.years = option.years.concat(nextyears)
      }
    } else if (opt.type == 'yearmonth') {
      option.months = [['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']]
      if(option.range) {
        option.value = option.value.concat(option.value)
        option.months = option.months.concat(option.months)
      }
    } else if (opt.type == 'time') {
      const hourArr:Array<number> = Array.from(new Array(23 + 1).keys()).slice(0)
      const minuteArr:Array<number> = Array.from(new Array(59 + 1).keys()).slice(0)
      const secondArr:Array<number> = minuteArr
      const clm = [hourArr, minuteArr, secondArr]
      option.times = [clm]
      if (opt.range) {
        option.times = option.times.concat([clm])
      }
      console.log(option.times)
    }
    return option
  }
}