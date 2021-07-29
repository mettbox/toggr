import Command from '../Command'
import Report from '../report'

export default class Date extends Command {
  static description = 'Get daily Toggl report by date <yyyy-mm-dd>'

  static examples = [
    '$ togglr day 2021-07-09',
  ]

  static args = [{name: 'reportDate'}]

  async run() {
    const {args} = this.parse(Date)

    if (!args.reportDate) {
      this.error('Date is missing')
    }

    new Report(
      await this.reportRequest(args.reportDate),
      args.reportDate
    ).print()
  }
}
