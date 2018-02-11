const glob = require('glob')

/**
 * Wrap glob in a promise
 */
module.exports = function promisifiedGlob(input) {
  return new Promise((resolve, reject) => {
    glob(input, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}