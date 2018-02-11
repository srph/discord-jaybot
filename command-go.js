const os = require('os')
const path = require('path')
const fs = require('pn/fs')
const {spawn} = require('pn/child_process')

const axios = require('axios')
const Jimp = require('jimp')
const randstring = require('randomstring')
const pick = require('./pick')

const Storage = require('@google-cloud/storage')
const bucket = new Storage().bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)

// Download image
// Process image
module.exports = async function go(message, args) {
  const text = args.join(' ').trim()

  const img = pick([
    'https://i.imgur.com/DySQW0P.jpg',
    'https://i.imgur.com/ta4ZI8I.jpg',
    'https://i.imgur.com/J0gndRO.jpg',
    'https://i.imgur.com/jLJxioL.jpg'
  ])

  if (!text.length) {
    return await message.channel.send(`Jaybot at your service. ${img}`)
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
  const image = await process(init, input, output, text)

  // Upload file
  await bucket.upload(output)
  // Publicize file
  await bucket.file(outputName).makePublic()

  // Send
  const link = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME}/${outputName}`
  await message.channel.send(`Jaybot at your service. ${link}`)

  // Clean up
  await fs.unlink(input)
  await fs.unlink(output)
}

async function process(base, input, output, text) {
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