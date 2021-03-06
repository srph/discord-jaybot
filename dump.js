const Jimp = require('jimp')
const fs = require('pn/fs')
const path = require('path')
const bucket = require('./bucket')
const glob = require('./utils/glob')

const rimraf = require('./utils/rimraf')
const mkdirp = require('./utils/mkdirp')

const input = path.resolve('imgsrc')
const output = path.resolve('imgdump')

module.exports = async function dump() {
  // Cleanup
  await Promise.all([rimraf(input), rimraf(output)])
  await Promise.all([mkdirp(input), mkdirp(output)])
  await download()
  await optimize()
}
/**
 * Downloads all the files from the bucket locally
 */
async function download() {
  const dir = process.env.GOOGLE_CLOUD_STORAGE_SOURCE_DIR

  // Fetch the list of files from that directory.
  // We'll run `slice` because the `getFiles` includes the directory name.
  const files = (await bucket.getFiles({
    prefix: dir
  }))[0].slice(1)

  // Download all the files locally to `./imgdump`
  await Promise.all(files.map(async file => {
    await bucket.file(file.metadata.name).download({
      destination: path.join(input, path.basename(file.metadata.name))
    })
  }))
}

/**
 * Reduces the width to 300px with its original ratio.
 */
async function optimize() {
  const optim = 300
  const files = await glob(path.join(input, '*'))
  
  await files.map(async file => {
    const img = await Jimp.read(file)

    // We won't have to resize
    if (img.bitmap.width <= optim) {
      return
    }

    // Reduce to optimal size
    const scaleDifference = (optim / img.bitmap.width)
    img.scale(scaleDifference)
    img.write(path.join(output, path.basename(file)))
  })
}