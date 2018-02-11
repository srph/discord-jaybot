const os = require('os')
const path = require('path')
const fs = require('pn/fs')
const {spawn} = require('pn/child_process')
const glob = require('../utils/glob')

const axios = require('axios')
const Jimp = require('jimp')
const randstring = require('randomstring')
const pick = require('../utils/pick')
const log = require('../utils/log')
const Storage = require('@google-cloud/storage')

// Download image
// Process image
module.exports = async function go(message, args) {
  const text = args.join(' ').trim()

  const img = pick([
    'https://i.imgur.com/DySQW0P.jpg',
    'https://i.imgur.com/ta4ZI8I.jpg',
    'https://i.imgur.com/J0gndRO.jpg',
    'https://i.imgur.com/jLJxioL.jpg',
    'https://i.imgur.com/BwCYsZu.jpg',
    'https://i.imgur.com/IAMtR3R.jpg'
  ])

  if (!text.length) {
    return await message.channel.send(log.channel(img))
  }

  // Initialize file names
  const fn = `jaybot-${randstring.generate()}`
  const input = path.resolve(os.tmpdir(), `${fn}.svg`)
  const outputName = `${fn}.png`
  const output = path.resolve(os.tmpdir(), outputName)

  // Download
  // https://i.imgur.com/DySQW0P.jpg -> <Buffer>
  const init = await download(img)

  // Convert files
  // <Buffer> -> <String> (Base64)
  const image = await convert(init, input, output, text)

  // Upload file
  const bucket = new Storage().bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)
  await bucket.upload(output)
  // Publicize file
  await bucket.file(outputName).makePublic()

  // Send
  const link = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME}/${outputName}`
  await message.channel.send(log.channel(link))

  // Clean up
  await cleanup()
}

async function cleanup() {
  const pattern = path.resolve(os.tmpdir(),'jaybot-*')

  const files = await glob(pattern)

  files.forEach((file) => {
    if (fs.exists(file)) {
      fs.unlink(file)
    }
  })
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

async function download(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer'})
  return Buffer.from(res.data)
}

async function next() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}