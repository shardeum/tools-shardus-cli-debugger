const { ensureExists, streamExtractFile } = require('./utils')

async function get(instanceUrl, instanceDir, progressFn) {
  // Ensure that the instanceDir exists
  await ensureExists(instanceDir)

  // Stream and extract tar.gz debug file into instance dir
  await streamExtractFile(`http://${instanceUrl}/debug`, instanceDir, progressFn)
}

module.exports = get
