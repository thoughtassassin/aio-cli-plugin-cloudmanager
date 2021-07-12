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

const { Command } = require('@oclif/command')
const { initSdk } = require('./cloudmanager-helpers')

class BaseCommerceCommand extends Command {
  async runSync(programId, environmentId, body, imsContextName = null) {
    let status = 'RUNNING';
    let result;

    const sdk = await initSdk(imsContextName)
    const postResponse = await sdk.postCLICommand(programId, environmentId, body)

    const { id : commandId } = await postResponse

    while (status === 'RUNNING') {
      await this.sleep(1000)
      const getResponse = await sdk.getCLICommand(programId, environmentId, commandId)

      result = await getResponse
      this.log(result.message, result.status)
      status = result.status
    }
    
    return result
  }

  async sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
}

module.exports = BaseCommerceCommand
