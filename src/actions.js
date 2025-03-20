const lib = require('./lib')

async function get(args, options, logger) {
  try {
    await lib.get(args['instanceUrl'], args['instanceDir'] || process.cwd(), ({ url, savePath, transferred }) => {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(`Downloading from ${url} into ${savePath} (${transferred} B)`)
    })
    process.stdout.write('\n')
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

async function collect(args, options, logger) {
  try {
    await lib.collect(
      args['instanceUrl'],
      args['networkDir'] || process.cwd(),
      ({ currentNode, totalNodes, url, savePath, transferred }) => {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(
          `(${currentNode}/${totalNodes}) Downloading from ${url} into ${savePath} (${transferred} B)`
        )
      }
    )
    process.stdout.write('\n')
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

function combine(args, options, logger) {
  try {
    lib.combine(args['networkDir'])
  } catch (e) {
    logger.error('Error: ' + e.message)
  }
}

exports.get = get
exports.collect = collect
exports.combine = combine
