import * as fs from 'fs'
import * as path from 'path'

type configObject = {
  apiToken: string;
  apiUserAgent: string;
  workspaceId: number;
}

/**
 * Config
 *
 * @class
 */
export default class Config {
  /**
   * Config Path
   *
   * @private
   */
  readonly #configPath: string

  /**
   * Toggl API Token
   *
   * @private
   */
  #apiToken: string

  /**
   * Toggl API User
   *
   * @private
   */
  #apiUserAgent: string

  /**
   * Toggl Workspace ID
   *
   * @private
   */
  #workspaceId: number

  /**
   * Toggl Workspaces API URL
   */
  static apiUrl = 'https://api.track.toggl.com/api/v8/'

  /**
   * Toggl Reports API URL
   */
  static reportsApiUrl = 'https://api.track.toggl.com/reports/api/v2/details'

  /**
   * Default config
   */
  static defaultConfig: configObject = {
    apiToken: '',
    apiUserAgent: '',
    workspaceId: -1,
  }

  /**
   * Make Config
   *
   * @returns {Promise<Config>} Config Instance
   */
  static async make(): Promise<Config> {
    const os = process.platform
    const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    const configPath: string = os === 'win32' ?
      path.resolve(homeDir, 'AppData', 'Local', 'toggr', 'toggr.json') :
      path.resolve(homeDir, 'Library', 'Preferences', 'toggr.json')

    if (!fs.existsSync(configPath)) {
      try {
        fs.writeFileSync(
          configPath,
          JSON.stringify(
            Config.defaultConfig
          )
        )
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    }

    const configFile = JSON.parse(
      fs.readFileSync(configPath)
    )

    return new Config(
      Object.assign(
        Config.defaultConfig,
        configFile
      ), configPath
    )
  }

  /**
   * Constructor
   *
   * @param {configObject} config - initial config object
   * @param {string} configPath - config path
   */
  constructor(config: configObject, configPath: string) {
    this.#configPath = configPath
    this.#apiToken = config.apiToken
    this.#apiUserAgent = config.apiToken
    this.#workspaceId = config.workspaceId
  }

  /**
   * Set apiToken
   *
   * @param {string} apiToken - Toggl API token
   */
  public set apiToken(apiToken: string) {
    this.#apiToken = apiToken
  }

  /**
   * Get apiToken
   *
   * @returns {string} apiToken
   */
  public get apiToken(): string {
    return this.#apiToken
  }

  /**
   * Set apiUserAgent
   *
   * @param {string} apiUserAgent - Toggl API User Agent
   */
  public set apiUserAgent(apiUserAgent: string) {
    this.#apiUserAgent = apiUserAgent
  }

  /**
   * Get apiUserAgent
   *
   * @returns {string} apiUserAgent
   */
  public get apiUserAgent(): string {
    return this.#apiUserAgent
  }

  /**
   * Set workspaceId
   *
   * @param {string} workspaceId - Toggl Workspace ID
   */
  public set workspaceId(workspaceId: number) {
    this.#workspaceId = workspaceId
  }

  /**
   * Get workspaceId
   *
   * @return {number} workspaceId
   */
  public get workspaceId(): number {
    return this.#workspaceId
  }

  /**
   * Get config
   *
   * @returns {any} config
   */
  public get config(): any {
    return this.#configPath
  }

  /**
   * Persist config
   *
   * @returns {Promise<void>} resolves when config file is stored
   */
  public async store(): Promise<void> {
    try {
      fs.writeFileSync(this.#configPath, JSON.stringify({
        apiToken: this.#apiToken,
        apiUserAgent: this.#apiUserAgent,
        workspaceId: this.#workspaceId,
      }))
    } catch (error) {
      throw new Error(error)
    }
  }
}
