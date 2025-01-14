/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { initSdk, getProgramId, getOutputFormat } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const commonFlags = require('../../../common-flags')
const BaseCommand = require('../../../base-command')

class ListPipelinesCommand extends BaseCommand {
  async run () {
    const { flags } = this.parse(ListPipelinesCommand)

    const programId = getProgramId(flags)

    const result = await this.listPipelines(programId, flags.imsContextName)

    cli.table(result, {
      id: {
        header: 'Pipeline Id',
      },
      name: {},
      status: {},
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }

  async listPipelines (programId, imsContextName = null) {
    const sdk = await initSdk(imsContextName)
    return sdk.listPipelines(programId)
  }
}

ListPipelinesCommand.description = 'lists pipelines available in a Cloud Manager program'

ListPipelinesCommand.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

ListPipelinesCommand.aliases = [
  'cloudmanager:list-pipelines',
]

module.exports = ListPipelinesCommand
