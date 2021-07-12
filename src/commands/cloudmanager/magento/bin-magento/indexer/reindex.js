const {Command} = require('@oclif/command')
const {chalk} = require('chalk');

const payload = [
  'Design Config Grid index',
  'Customer Grid index',
  'Category Products index',
  'Product Categories index',
  'Catalog Rule Product index',
  'Product EAV index',
  'Stock index',
  'Inventory index',
  'Catalog Product Rule index',
  'Product/Target Rule index',
  'Target Rule/Product index',
  'Product Price index',
  'Catalog Search index',
  'Sales Rule index',
]

class Reindex extends Command {
  async run() {
    const startedAt = new Date()
    this.log(`Started at: ${startedAt.toISOString()}`)
    this.log('To stream logs : aio cloudmanager:magento:command:tail-log 1234')
    this.log('STATUS: RUNNING')
    await this.sleep(1000)
    let counter = 0;
    const payloadLengthX2 = payload.length * 2
    while (counter < payloadLengthX2) {
      await this.sleep(1000)
      counter % 2 === 0 ? process.stdout.write(`${payload.shift()} `) : process.stdout.write('has been rebuilt successfully\n')
      counter++      
    }
    await this.sleep(1000)
    this.log('STATUS: COMPLETE')
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

Reindex.description = 'description of this example command'

module.exports = Reindex