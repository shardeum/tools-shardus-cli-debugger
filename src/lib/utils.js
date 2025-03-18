const fs = require('fs')
const path = require('path')
const got = require('got')
const tar = require('tar')

// From: https://stackoverflow.com/a/21196961
function ensureExists(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        // Ignore err if folder exists
        if (err.code === 'EEXIST') resolve()
        // Something else went wrong
        else reject(err)
      } else {
        // Successfully created folder
        resolve()
      }
    })
  })
}

function streamExtractFile(url, savePath, progressFn) {
  return new Promise((resolve, reject) => {
    const download = got.stream(url, { decompress: false })
    download.on('error', reject)
    download.on('downloadProgress', (progress) => {
      const normalized = path.normalize(path.relative(process.cwd(), savePath))
      progressFn({ url, savePath: normalized, ...progress })
    })

    const out = tar.extract({ cwd: savePath })
    out.on('error', reject)
    out.on('close', resolve)

    download.pipe(out)
  })
}

exports.ensureExists = ensureExists
exports.streamExtractFile = streamExtractFile
