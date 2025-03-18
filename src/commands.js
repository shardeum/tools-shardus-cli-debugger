const actions = require('./actions')

const register = {
  get(prog, namespace) {
    prog
      .command(`${namespace ? namespace + ' ' : ''}get`, 'Get debug data for the given instance')
      .argument('<instanceUrl>', 'URL of the instance to download debug data from')
      .argument('[instanceDir]', 'Path to unpack the instances debug data into. Unpacks into current path if not given')
      .action(actions.get)
  },
  collect(prog, namespace) {
    prog
      .command(`${namespace ? namespace + ' ' : ''}collect`, 'Collect debug data of all network instances')
      .argument('<instanceUrl>', 'URL of an instance in the network to download debug info from')
      .argument('[networkDir]', 'Path to put all network instances debug info into. Uses current path if not given')
      .action(actions.collect)
  },
  combine(prog, namespace) {
    prog
      .command(`${namespace ? namespace + ' ' : ''}combine`, 'Combine the logs of all instances in a test net')
      .argument('<networkDir>', 'A path containing multiple instanceDirs with logs')
      .action(actions.combine)
  },
}

module.exports = register
