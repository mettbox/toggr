import Command from '../../Command'
import cli from 'cli-ux'

export default class Show extends Command {
  static description = 'Show current Setup'

  static examples = [
    '$ togglr setup:show'
  ]

  async run() {
    const setup = {
      path: this.cfg.config,
      apiToken: this.cfg.apiToken,
      apiUserAgent: this.cfg.apiUserAgent,
      workspaceId: this.cfg.workspaceId
    }

    // eslint-disable-next-line no-console
    console.table(setup)
  }
}
