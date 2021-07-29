import {Table} from 'console-table-printer'

/**
 * Config
 *
 * @class
 */
export default class Report {
  /**
   * Entries
   *
   * @private
   */
  readonly #reportData: {
    count: number;
    duration: number;
    entries: { project: string; duration: number; description: string }[];
  }[]

  /**
   * ReportDate
   *
   * @private
   */
  readonly #reportDate

  /**
   * Constructor
   *
   * @param {any} data
   * @param {string} reportDate
   */
  constructor(data: {total_count: number; total_grand: number; data: {}[]}, reportDate: string) {
    this.#reportDate = reportDate
    this.#reportData = {
      count: data.total_count,
      duration: this.ms2Time(data.total_grand),
      entries: this.groupedData(data.data),
    }
  }

  /**
   * Log raw report data
   */
  public log(): void {
    const {inspect} = require('util')

    // eslint-disable-next-line no-console
    console.log(inspect(
      this.#reportData,
      false,
      null,
      true
    ))
  }

  /**
   * Log beautified report data
   */
  public print(): void {
    const chalk = require('chalk')

    const title = chalk.bold('Toggl Report', this.#reportDate, `(${this.#reportData.duration})`, ' '.repeat(44))

    console.log(`╔${'═'.repeat(78)}╗`)
    console.log(`║ ${title} ║`)
    console.log(`╚${'═'.repeat(78)}╝`)

    this.#reportData.entries.forEach(entry => {
      console.log('', chalk.bold(entry.client))
      const table = new Table({
        columns: [
          {
            name: 'project',
            title: 'Project',
            alignment: 'left',
            maxLen: 15,
            minLen: 15,
          },
          {
            name: 'duration',
            title: 'Duration',
            alignment: 'center',
            maxLen: 6,
            minLen: 6,
          },
          {
            name: 'descriptions',
            title: 'Description',
            alignment: 'left',
            maxLen: 47,
            minLen: 47,
          },
        ],
      })

      entry.projects.forEach(project => table.addRow(project))
      table.printTable()
    })
  }

  /**
   * Grouped entries by client, projects, descriptions
   *
   * @param {{}[]} entries
   * @returns {{ client: string, projects: {}[]}[]} grouped Object
   * @private
   */
  private groupedData(entries): { client: string; projects: {}[]}[] {
    const groupByClientsKeys = this.groupBy(entries, 'client')

    return Object.keys(groupByClientsKeys).map(client => {
      const groupByProjectKeys = this.groupBy(groupByClientsKeys[client], 'project')

      const projects = Object.keys(groupByProjectKeys).map(projectGroup => {
        const duration = groupByProjectKeys[projectGroup].reduce((durations, project) => {
          return durations + project.dur
        }, 0)

        const groupByDescriptionKeys = this.groupBy(groupByProjectKeys[projectGroup], 'description')

        return {
          project: projectGroup,
          duration: this.ms2Time(duration),
          descriptions: Object.keys(groupByDescriptionKeys).join(' // '),
        }
      })

      return {client, projects}
    })
  }

  /**
   * Group Array of Objects by key
   *
   * @param {{}[]} items
   * @param {string} key
   * @returns {[key: string]: {}[]} grouped object
   * @private
   */
  private groupBy(items: {}[], key: string): {[key: string]: {}[]} {
    return items.reduce((group: {}, entry: {}) => {
      group[entry[key]] = [...group[entry[key]] || [], entry]

      return group
    }, {})
  }

  /**
   * Convert Milliseconds to hh:mm
   *
   * @param {number} duration - duration in milliseconds
   * @returns {string} formatted duration
   */
  ms2Time(duration: number): string {
    let minutes = parseInt((duration/(1000*60))%60, 10)
    let hours = parseInt((duration/(1000*60*60))%24, 10)

    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes

    return hours + ':' + minutes
  }
}
