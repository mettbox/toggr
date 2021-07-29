import Command from '../Command'
import Report from '../report'

export default class Today extends Command {
  static description = 'Get daily Toggl report'

  static examples = [
    '$ togglr today',
  ]

  async run() {
    const reportDate = new Date().toISOString().slice(0, 10)

    new Report(
      await this.reportRequest(reportDate),
      reportDate
    ).print()
  }
}
