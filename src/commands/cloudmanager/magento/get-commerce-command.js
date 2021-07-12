const { Command } = require('@oclif/command')
const { initSdk, getProgramId } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const notifier = require('node-notifier')

class GetCommerceCommand extends Command {
  async run () {
    const { args, flags } = this.parse(GetCommerceCommand)

    const programId = await getProgramId(flags)

    let result

    cli.action.start('getting commerce command')

    try {
      result = await this.getCLICommand(programId, args.environmentId, args.commandId)
    } catch (error) {
      console.log(error)
      return
    }

    cli.action.stop(`commerce command result: \n${result.data}`)

    notifier.notify({
      title: 'Commerce Command',
      message: result.data,
      timeout: false
    })

    return result
  }

  async getCLICommand (programId, environmentId, commandId) {
    const sdk = await initSdk(null)
    return sdk.getCLICommand(programId, environmentId, commandId)
  }
}

GetCommerceCommand.description = 'get commerce command progress'

GetCommerceCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
}

GetCommerceCommand.args = [
  { name: 'environmentId', required: true, description: 'the environment id' },
  { name: 'commandId', required: true, description: 'the command id' },
]

GetCommerceCommand.aliases = ['cloudmanager:magento:get-commerce-command', 'cloudmanager:get-commerce-command']

module.exports = GetCommerceCommand
