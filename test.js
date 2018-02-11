const fs = require('pn/fs')
const path = require('path')
const os = require('os')
const Jimp = require('jimp')
const axios = require('axios')
const randstring = require('randomstring')
const {spawn} = require('child_process')
const formdata = require('./formdata')
const text = 'PangET AKO'

// async function main() {
//   const file = await fs.readFile('test.png')

//   const img = await Jimp.read(file)

//   const src = new Buffer(`
// <svg width="${img.bitmap.width}px" height="${img.bitmap.height}px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//   <image xlink:href="data:image/png;base64,${file.toString('base64')}" x="0" y="0"></image>
//   <text x="${img.bitmap.width / 2}" y="${img.bitmap.height - 32}" font-size="32px" font-family="Impact" stroke-width="1" stroke="red" color="black" text-anchor="middle" alignment-baseline="middle">${text}</text>
// </svg>
// `)

//   const name = `jaybot-${randstring.generate()}`
//   const input = path.resolve(os.tmpdir(), `${name}.svg`)
//   const output = path.resolve(os.tmpdir(), `${name}.png`)
//   await fs.writeFile(input, src)
//   await spawn('gm', ['convert', input, output])
//   await fs.unlink(input, output)
// }

async function main() {
  // const i = await fs.readFile('xx.png')
  // const payload = { image: i.toString('base64') }

  // try {
  //   const res = await axios.post('https://api.imgur.com/3/image', payload, {
  //     headers: {
  //       Authorization: `Bearer d254cee514e8b417d70fcb7f55863f7760533101`,
  //     }
  //   })

  //   console.log(res.data.data)
  // } catch(e) {
  //   // delete e.response.data
  //   console.log(e.response.data.data.error.substr(0, 100))
  // }

  const res = await axios.get('https://imgur.com/J0gndRO.jpg', { responseType: 'arraybuffer'})
  await fs.writeFile('lol.jpg', res.data)
}

main()