import Command from '../../Command'

export default class Show extends Command {
  static description = 'show setup'

  static examples = [
    '$ toggr setup:show',
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
