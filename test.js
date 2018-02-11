require('dotenv').load()

const bucket = require('./bucket')

async function main() {
  const files = (await bucket.getFiles({ prefix: 'base/' }))[0]
  console.log(files.map(file => file.metadata))
}

main()