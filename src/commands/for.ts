import Command from '../Command'
import Report from '../report'

export default class For extends Command {
  static description = 'report by date'

  static examples = [
    '$ togglr for 2021-07-09',
  ]

  static args = [{name: 'reportDate'}]

  /**
   * Is valid date string
   *
   * @param {string} dateString - date string
   * @returns {boolean} isValid
   */
  isValidDate(dateString: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/

    // Invalid format
    if (!dateString.match(regEx)) {
      return false
    }
    const d = new Date(dateString)
    const dNum = d.getTime()

    // NaN value, Invalid date
    if (!dNum && dNum !== 0) {
      return false
    }

    return d.toISOString().slice(0, 10) === dateString
  }

  async run() {
    const {args} = this.parse(For)

    if (!args.reportDate) {
      this.error('Date is missing')
    }

    if (!this.isValidDate(args.reportDate)) {
      this.error('Wrong Date format')
    }

    new Report(
      await this.reportRequest(args.reportDate),
      args.reportDate
    ).print()
  }
}
