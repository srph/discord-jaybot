const Jimp = require('jimp')
const path = require('path')
const glob = require('./utils/glob')
const optim = 300

async function main() {
  const files = await glob(path.resolve(__dirname, 'imgsrc/*'))
  
  files.forEach(async file => {

    const img = await Jimp.read(file)

    // We won't have to resize
    if (img.bitmap.width <= optim) {
      return
    }

    // Reduce to optimal size
    const scaleDifference = (optim / img.bitmap.width)
    img.scale(scaleDifference)
    img.write(path.resolve(__dirname, 'imgdump', path.basename(file)))
  })
}

try {
  main()
} catch(e) {
  console.log(e)
}