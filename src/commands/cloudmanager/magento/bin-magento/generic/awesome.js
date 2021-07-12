const BaseCommerceCommand = require("../../../../../base-commerce-command");
const { getProgramId } = require("../../../../../cloudmanager-helpers");
const { cli } = require("cli-ux");
const commonFlags = require("../../../../../common-flags");
const notifier = require("node-notifier");

class Awesome extends BaseCommerceCommand {
  async run() {
    const { args, flags } = this.parse(Awesome);

    const programId = await getProgramId(flags);

    let result;

    cli.action.start("getting commerce command");

    try {
      result = await this.runSync(programId, args.environmentId, {
        type: "BIN-MAGENTO",
        command: "indexer:reindex",
      });
    } catch (error) {
      cli.action.stop(error.message);
      return;
    }

    cli.action.stop("commerce command result:", result);

    notifier.notify({
      title: "Commerce Command",
      message: result.message,
      timeout: false,
    });

    return result;
  }
}

Awesome.description = "get base commerce command";

Awesome.flags = {
  ...commonFlags.global,
  ...commonFlags.programId,
};

Awesome.args = [
  { name: "environmentId", required: true, description: "the environment id" },
];

module.exports = Awesome;
