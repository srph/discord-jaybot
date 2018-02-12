const os = require('os')
const path = require('path')
const fs = require('pn/fs')
const {spawn} = require('pn/child_process')
const glob = require('../utils/glob')
const rimraf = require('../utils/rimraf')

const axios = require('axios')
const Jimp = require('jimp')
const randstring = require('randomstring')
const pick = require('../utils/pick')
const log = require('../utils/log')
const bucket = require('../bucket')
const gcs = require('../utils/gcs')

// Download image
// Process image
module.exports = async function go(message, args) {
  const text = args.join(' ').trim()

  const img = pick(await glob(
    path.resolve(__dirname, '..', 'imgdump', '*')
  ))

  if (!text.length) {
    await message.channel.send(log.channel(
      gcs.public(path.join(process.env.GOOGLE_CLOUD_STORAGE_SOURCE_DIR, path.basename(img)))
    ))

    return
  }

  // Initialize file names
  const fn = `jaybot-${randstring.generate()}`
  const input = path.resolve(os.tmpdir(), `${fn}.svg`)
  const outputName = `${fn}.png`
  const output = path.resolve(os.tmpdir(), outputName)

  // Convert files
  // <Buffer> -> <String> (Base64)
  const image = text.length
    ? await convert(await fs.readFile(img), input, output, text)
    : await fs.readFile(img)

  // Upload file
  await bucket.upload(output)
  // Publicize file
  await bucket.file(outputName).makePublic()

  // Send
  await message.channel.send(log.channel(gcs.public(outputName)))

  // Clean up
  await rimraf(path.resolve(os.tmpdir(),'jaybot-*'))
}

async function convert(base, input, output, text) {
  const img = await Jimp.read(base)

  const svg = new Buffer(`
<svg width="${img.bitmap.width}px" height="${img.bitmap.height}px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image xlink:href="data:image/png;base64,${base.toString('base64')}" x="0" y="0"></image>
  <text x="${img.bitmap.width / 2}" y="${img.bitmap.height - 32}" font-size="32px" font-family="Impact" stroke-width="1" stroke="red" color="black" text-anchor="middle" alignment-baseline="middle">${text}</text>
</svg>
`)

  await fs.writeFile(input, svg)
  await spawn('gm', ['convert', input, output], { shell: true })
  await next()
  const png = await fs.readFile(output)
  return png.toString('base64')
}

async function next() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}