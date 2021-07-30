import Command from '../../Command'
import cli from 'cli-ux'
import {flags} from '@oclif/command'

export default class Auth extends Command {
  static description = 'setup api token and user'

  static examples = [
    '$ togglr setup:auth --token <YOUR-TOKEN> --user <YOUR-USER>',
  ]

  static flags = {
    force: flags.boolean(),
    token: flags.string(),
    user: flags.string(),
  }

  async run() {
    const {flags} = this.parse(Auth)

    if ((this.cfg.apiToken || this.cfg.apiUserAgent) && !flags.force) {
      await this.shouldCancel('API Credentials')
    }

    if (!flags.token) {
      flags.token = await cli.prompt('Enter your API token')
    }

    if (!flags.user) {
      flags.user = await cli.prompt('Enter your API user')
    }

    this.cfg.apiToken = flags.token || ''
    this.cfg.apiUserAgent = flags.user || ''

    await this.cfg.store()

    this.log('API Auth credentials stored')
  }
}
