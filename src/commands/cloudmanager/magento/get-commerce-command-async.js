const { Command } = require("@oclif/command");
const { spawn } = require('child_process');
const commonFlags = require("../../../common-flags");

class GetCommerceCommandAsync extends Command {
  async run() {
    const { args } = this.parse(GetCommerceCommandAsync)
    
    try {
      const npmProcess = spawn(
        'npm', 
        ['run', 'run-commerce-command-async', args.environmentId, args.commandId],
        {
          detached: true,
          stdio: 'ignore'
        }
      )

      npmProcess.unref()
      this.log('\trunning commerce command...\n')
    } catch (e) {
      this.log(e)
    }
  }
}

GetCommerceCommandAsync.description = "get commerce command progress";

GetCommerceCommandAsync.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
};

GetCommerceCommandAsync.args = [
  { name: "environmentId", required: true, description: "the environment id" },
  { name: "commandId", required: true, description: "the command id" },
];

GetCommerceCommandAsync.aliases = [
  "cloudmanager:magento:get-commerce-command",
  "cloudmanager:get-commerce-command",
];

module.exports = GetCommerceCommandAsync;
