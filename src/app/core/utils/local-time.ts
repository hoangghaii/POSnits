import * as moment from 'moment';

export class LocalTime {
  protected static opts = {
    useGMT: true,
    fmtDateTime: 'YYYY-MM-DD HH:mm:ss',
    fmtDate: 'YYYY-MM-DD',
    fmtTime: 'HH:mm:ss'
  };

  private static dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  constructor() {
  }

  /**
   * Get date
   *
   * @param string fmt
   *
   * @return string
   */
  static getDate(fmt = this.opts.fmtDateTime): string {
    return moment().format(fmt);
  }

  /**
   * Parse date
   *
   * @param string|date date
   * @param string fmt
   *
   * @return string
   */
  static formatDate(date: any, fmt = this.opts.fmtDate): string {
    if (!date) {
      return moment().format(fmt);
    }

    return moment(date).format(fmt);
  }

  /**
   * Get first day of the month
   *
   * @param date
   * @param fmt
   */
  static startOfMonth(date: any, fmt = this.opts.fmtDate): string {
    if (!date) {
      return moment().startOf('month').format(fmt);
    }

    return moment(date).startOf('month').format(fmt);
  }

  /**
   * Get Date of week
   */
  static getDateAndTime(date: any): string {
    const newDate = new Date(date);
    return `${newDate?.getFullYear()}年${(newDate.getMonth() + 1)}月${newDate.getDate()}日(${this.dayOfWeek[newDate?.getDay()]})`
  }
}
