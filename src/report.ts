import * as chalk from 'chalk'
import * as clipboardy from 'clipboardy'
import {Table} from 'console-table-printer'
import {entriesObject, reportDataObject, reportInputData, reportInputEntry} from './types'

const keypress = require('keypress')

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
  readonly #reportData: reportDataObject

  clipboard: {[key: string]: string}

  /**
   * ReportDate
   *
   * @private
   */
  readonly #reportDate: string

  /**
   * Constructor
   *
   * @param {reportInputData} data
   * @param {string} reportDate
   */
  constructor(data: reportInputData, reportDate: string) {
    this.#reportDate = reportDate
    this.#reportData = {
      duration: this.ms2Time(data.total_grand),
      entries: this.groupedData(data.data),
    }
    this.clipboard = {}
  }

  /**
   * Log beautified report data
   */
  public print(): void {
    const title = chalk.bold('Toggl Report', this.#reportDate, `(${this.#reportData.duration})`, ' '.repeat(44))

    console.log(`╔${'═'.repeat(78)}╗`)
    console.log(`║ ${title} ║`)
    console.log(`╚${'═'.repeat(78)}╝`)

    let key: string
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
            maxLen: 41,
            minLen: 41,
          },
          {
            name: 'hotkey',
            title: 'Key',
            alignment: 'center',
            maxLen: 3,
            minLen: 3,
          }
        ],
      })

      entry.projects.forEach((project: {project: string, duration: string, descriptions: string}) => {
        key = Report.nextChar(key)
        table.addRow({
          ...project,
          hotkey: key
        })
        this.clipboard = {
          ...this.clipboard,
          [key]: project.descriptions
        }
      })
      table.printTable()
    })

    this.keypressListener()
  }

  /**
   * Keypress listener
   *
   * @returns {void} keypress listener
   * @private
   */
  private keypressListener ():void {
    console.log('Press Key to copy Description or ⌃c to quit.')

    // make `process.stdin` begin emitting "keypress" events
    const {stdin} = process
    keypress(stdin)

    // listen for the "keypress" event
    stdin.on('keypress', (ch: any, key: { name: string, ctrl: boolean }) => {
      if (key && key.ctrl && key.name === 'c') {
        stdin.pause()
      }

      if (key && key.name && this.clipboard[key.name]) {
        clipboardy.writeSync(this.clipboard[key.name])
      }
    })

    if (stdin.setRawMode) {
      stdin.setRawMode(true)
    }

    stdin.resume()
  }

  /**
   * Increment letters
   *
   * @param {string} [char=''] - char
   * @returns {string} next char
   * @private
   */
  private static nextChar(char: string = '') {
    return char
      ? String.fromCharCode(char.charCodeAt(0) + 1)
      : 'a'
  }

  /**
   * Grouped entries by client, projects, descriptions
   *
   * @param {reportInputEntry[]} entries
   * @returns {entriesObject[]} grouped Object
   * @private
   */
  private groupedData(entries: reportInputEntry[]): entriesObject[] {
    const groupByClientsKeys = this.groupBy(entries, 'client')

    return Object.keys(groupByClientsKeys).map(client => {
      const groupByProjectKeys = <{[key: string]: reportInputEntry[]}>this.groupBy(groupByClientsKeys[client], 'project')

      const projects = Object.keys(groupByProjectKeys).map(projectGroup => {
        const duration = groupByProjectKeys[projectGroup].reduce((durations, {dur}) => {
          return durations + dur
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
    return items.reduce((group: {[key: string]: any}, entry: {[key: string]: any}) => {
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
    const minutes = (duration/(1000 * 60)) % 60
    const hours = Math.floor((duration/(1000 * 60 * 60)) % 24)

    const hoursString: string = (hours < 10)
      ? `0${hours}`
      : `${hours}`

    const minutesString: string = (minutes < 10)
      ? `0${minutes}`
      : `${minutes}`

    return `${hoursString}:${minutesString}`
  }
}
