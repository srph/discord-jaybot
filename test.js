const os = require('os')
const path = require('path')
const glob = require('./glob')

async function main() {
  const files = await glob(path.resolve(os.tmpdir(),'jaybot-*'))
  console.log(files)
}

main()