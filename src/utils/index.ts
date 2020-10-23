interface Days {
  year?:number,
  month?:number,
  day?:number,
  isMonth?:boolean,
  weekday?:number
}
export default class Utils {
  static parseToDom (html: string): NodeList {
    const div = document.createElement('div');
    if (typeof html == 'string') {
      div.innerHTML = html;
    }
    return div.childNodes;
  }
  static getFirstDay (year:number, month:number):number {
    return new Date(year, month - 1, 0).getDay()
  }
  static getMonthLength (year:number, month:number):number {
    return new Date(year, month, 0).getDate()
  }
  static getMonthDaysArray (date:string):Array<Array<Days>> {
    const time = new Date(date)
    const year:number = time.getFullYear()
    const month:number = time.getMonth() + 1
    // TODO: 获取上月，本月，下月三个月的数据
    const firstDay:number = this.getFirstDay(year, month)
    const curMonthDay:number = this.getMonthLength(year, month)
    const preMonthDay:number = this.getMonthLength(year, month - 1)
    const dayArr:Array<Array<Days>> = []
    const row:number = Math.ceil((firstDay + curMonthDay) / 7)
    for (let i = 0; i < row; i++) {
      const arr:Array<Days> = []
      for (let j = 0; j < 7; j++) {
        let m:number
        let y:number | undefined
        let day:number = i * 7 + j - firstDay + 1
        if (day <= 0) {
          m = month - 1
          y = m == 0 ? year - 1 : year
          day = day + preMonthDay
        } else if (day > curMonthDay) {
          y = y == 12 ? year + 1 : year
          day = day - curMonthDay
          m = month + 1
        } else {
          m = month
          y = year
        }
        let weekday = (new Date(y + '/' + m + '/' + day)).getDay()
        weekday = weekday > 0 ? weekday : 7
        arr.push({
          year: y,
          month: m,
          day: day,
          isMonth: m == month,
          weekday: weekday
        })
      }
      dayArr.push(arr)
    }
    return dayArr
  }
}