import Command from '../Command'
import Report from '../report'

export default class Yesterday extends Command {
  static description = 'report for yesterday'

  static examples = [
    '$ toggr yesterday',
  ]

  async run() {
    const yesterday = new Date()
    yesterday.setDate(new Date().getDate() - 1)
    const reportDate = yesterday.toISOString().slice(0, 10)

    new Report(
      await this.reportRequest(reportDate),
      reportDate
    ).print()
  }
}
