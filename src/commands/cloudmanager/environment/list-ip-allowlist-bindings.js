/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { getProgramId, getOutputFormat, columnWithArray } = require('../../../cloudmanager-helpers')
const { cli } = require('cli-ux')
const _ = require('lodash')
const commonFlags = require('../../../common-flags')
const commonArgs = require('../../../common-args')
const ListIpAllowlists = require('../program/list-ip-allowlists')
const BaseCommand = require('../../../base-command')

class ListIPAllowlistBindings extends BaseCommand {
  async run () {
    const { flags, args } = this.parse(ListIPAllowlistBindings)

    const programId = getProgramId(flags)

    let result = await new ListIpAllowlists().listIpAllowlists(programId, flags.imsContextName)

    result = result.filter(ipAllowlist => ipAllowlist.bindings.find(binding => binding.environmentId === args.environmentId))

    result.forEach(ipAllowlist => {
      ipAllowlist.boundServices = ipAllowlist.bindings.map(binding => binding.tier)
    })

    cli.table(result, {
      id: {
        header: 'Allowlist Id',
      },
      name: {},
      ipCidrSet: columnWithArray('ipCidrSet', {
        header: 'CIDR Blocks',
      }, flags),
      boundServices: columnWithArray('boundServices', {
        header: 'Bound Services',
        mapperFunction: _.startCase,
      }, flags),
    }, {
      printLine: this.log,
      output: getOutputFormat(flags),
    })

    return result
  }
}

ListIPAllowlistBindings.description = 'lists IP Allowlists bound to an environment'

ListIPAllowlistBindings.args = [
  commonArgs.environmentId,
]

ListIPAllowlistBindings.flags = {
  ...commonFlags.global,
  ...commonFlags.outputFormat,
  ...commonFlags.programId,
}

ListIPAllowlistBindings.aliases = [
  'cloudmanager:environment:list-bound-ip-allowlists',
]

module.exports = ListIPAllowlistBindings
