import Command from '../../Command'
import axios from 'axios'
import {flags} from '@oclif/command'
import Config from '../../config'
import * as inquirer from 'inquirer'

/**
 * Define workspace/ workspace list
 */
type workspaceObject = { id: number; name: string }
type workspaceChoices = { name: string; value: number }[]

export default class Workspace extends Command {
  static description = 'Setup Toggl Workspace ID'

  static examples = ['$ togglr setup:workspace <YOUR-WORKSPACE-ID>']

  static flags = {
    force: flags.boolean(),
  }

  static args = [
    {name: 'workspaceId'},
  ]

  async run() {
    const {args, flags} = this.parse(Workspace)

    if (this.cfg.workspaceId > 0 && !flags.force) {
      await this.shouldCancel('Workspace ID')
    }

    if (!args.workspaceId) {
      const {workspaceId} = await inquirer.prompt([{
        name: 'workspaceId',
        message: 'Select a workspace',
        type: 'list',
        choices: await this.getWorkspaces(),
      }])

      args.workspaceId = workspaceId
    }

    this.cfg.workspaceId = parseInt(args.workspaceId, 10)

    await this.cfg.store()

    this.log('Workspace ID stored')
  }

  /**
   * Get list of workspaces
   *
   * @returns {Promise<workspaceChoices>} Workspaces
   */
  async getWorkspaces(): Promise<workspaceChoices> {
    const workspaces = await this.request(Config.apiUrl)

    return workspaces.map((workspace: workspaceObject) => {
      return {
        name: workspace.name,
        value: workspace.id,
      }
    })
  }
}
