import * as inquirer from 'inquirer'
import Command from '@oclif/command'
import Config from './config'
import axios from 'axios'
import cli from 'cli-ux'
import { reportInputData } from './types'

export default abstract class extends Command {
  /**
   * Config instance
   *
   * Exclamation mark after variable/property name telling TypeScript
   * that cfg is not null or undefined
   */
  cfg!: Config

  /**
   * Global init
   */
  async init(): Promise<void> {
    this.cfg = await Config.make()
  }

  /**
   * Should cancel command?
   *
   * @param {string} label - Confirm message label
   * @returns {Promise<void>} resolver - Overwrite prompt
   */
  async shouldCancel(label: string): Promise<void> {
    const {shallContinue} = await inquirer.prompt([{
      type: 'confirm',
      name: 'shallContinue',
      message: `Overwrite existing ${label}?`,
      default: (): boolean => false,
    }])

    if (!shallContinue) {
      // eslint-disable-next-line no-process-exit
      process.exit()
    }
  }

  /**
   * Toggl API request
   *
   * @param {string} request - API request
   * @returns {Promise<[]>} Axios Response
   */
  async apiRequest(request: string): Promise<[]> {
    try {
      cli.action.start('Fetching data from Toggl API...')
      const response = await axios.get(Config.apiUrl + request, {
        auth: {
          username: this.cfg.apiToken,
          password: 'api_token',
        },
      })

      cli.action.stop()

      return response.data
    } catch (error) {
      cli.action.stop()
      throw new Error(error)
    }
  }

  /**
   * Toggle Report by date
   *
   * @param {string} reportDate - Date [YYYY-MM-DD]
   * @returns {Promise<{reportInputData} report results
   */
  async reportRequest(reportDate: string): Promise<reportInputData> {
    try {
      cli.action.start('Fetching data from Toggl API...')
      const response: {data: reportInputData} = await axios.get(Config.reportsApiUrl, {
        auth: {
          username: this.cfg.apiToken,
          password: 'api_token',
        },
        params: {
          since: reportDate,
          until: reportDate,
          user_agent: this.cfg.apiUserAgent,
          workspace_id: this.cfg.workspaceId,
        },
      })

      cli.action.stop()

      const {data} = response
      return {
        total_count: data.total_count,
        total_grand: data.total_grand,
        data: data.data
      }
    } catch (error) {
      cli.action.stop()
      throw new Error(error)
    }
  }
}
