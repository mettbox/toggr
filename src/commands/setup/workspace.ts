import * as inquirer from 'inquirer'
import Command from '../../Command'
import {flags} from '@oclif/command'

/**
 * Define workspace/ workspace list
 */
type workspaceObject = { id: number; name: string }
type workspaceChoices = { name: string; value: number }[]

export default class Workspace extends Command {
  static description = 'setup workspace id'

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
    const workspaces = await this.apiRequest('workspaces')

    return workspaces.map((workspace: workspaceObject) => {
      return {
        name: workspace.name,
        value: workspace.id,
      }
    })
  }
}
