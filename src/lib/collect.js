const path = require('path')
const got = require('got')
const { ensureExists, streamExtractFile } = require('./utils')

async function collect(instanceUrl, networkDir, progressFn) {
  // Ensure that the networkDir exists
  await ensureExists(networkDir)

  // Get nodelist
  const nodelistUrl = new URL('/nodelist', `http://${instanceUrl}`)
  const {
    body: { nodelist },
  } = await got.get(nodelistUrl.toString(), { json: true })

  // Stream and extract tar.gz debug file into each instances dir
  for (const [index, node] of nodelist.entries()) {
    // Hacks for the case when a remote server is running local instances
    if (instanceUrl.split(':').length === 2) instanceUrl = instanceUrl.split(':')[0]
    if (node.externalIp === '127.0.0.1' && instanceUrl !== '127.0.0.1') node.externalIp = instanceUrl

    const debugUrl = new URL('/debug', `http://${node.externalIp}:${node.externalPort}`)
    const savePath = path.join(networkDir, `debug-${debugUrl.hostname}-${debugUrl.port}`)
    await ensureExists(savePath)
    try {
      await streamExtractFile(debugUrl.toString(), savePath, (progress) =>
        progressFn({ currentNode: index + 1, totalNodes: nodelist.length, ...progress })
      )
    } catch (err) {
      console.log('ERR: ', `http://${node.externalIp}:${node.externalPort} Connection refused`)
      continue
    }
  }
}

module.exports = collect
