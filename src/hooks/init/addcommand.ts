import BaseCommerceCommand from '../../base-commerce-cli'
import { getProgramId } from '../../cloudmanager-helpers'
import commonFlags from '../../common-flags-ts'
import * as Config from '@oclif/config'
import ux from 'cli-ux'

class DynamicPlugin extends Config.Plugin {
  get hooks() { return {} }
  get topics() {
    return []
  }
  get commandIDs() {
    return ['cloudmanager:commerce:bin-magento:reindexer:index', 'cloudmanager:commerce:bin-magento:cache:clean']
  }

  get commands(): Config.Command.Plugin[] {
    const cmds = ['bin-magento:reindexer:index', 'bin-magento:cache:clean']
    const dyncmds = cmds.map(cmd => class extends BaseCommerceCommand {
      static id = 'cloudmanager:commerce:' + cmd
      static load() { return this }
      async run() {
        const { args, flags } = this.parse(this)
        const programId = getProgramId(flags)
        let result
        try {
          result = await this.runSync(programId, args.environmentId,
            {
              type: cmd.substring(0, cmd.indexOf(':')),
              command: cmd.substring(cmd.indexOf(':') + 1),
            },
            1000, cmd.substring(cmd.indexOf(':') + 1))
        } catch (error) {
          ux.action.stop(error.message)
          return
        }
        return result
      }
      static args = [
        { name: 'environmentId', required: true, description: 'the environment id' },
      ]
      static flags = {
        ...commonFlags.global,
        ...commonFlags.programId,
      }
    })
    return dyncmds
  }
}

const hook: Config.Hook<'init'> = async function () {
  this.config.plugins.push(new DynamicPlugin(this.config))
}

export default hook