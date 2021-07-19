import { flags } from '@oclif/command'

export default {
  global: {
    imsContextName: flags.string({ description: 'the alternate IMS context name to use instead of aio-cli-plugin-cloudmanager' }),
  },
  programId: {
    programId: flags.string({ char: 'p', description: "the programId. if not specified, defaults to 'cloudmanager_programid' config value" }),
  },
  outputFormat: {
    json: flags.boolean({ char: 'j', description: 'output in json format', exclusive: ['yaml'] }),
    yaml: flags.boolean({ char: 'y', description: 'output in yaml format' }),
  },
}