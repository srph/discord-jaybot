var mkdirp = require('mkdirp');

module.exports = function promisifiedMkdirp(input) {
  return new Promise((resolve, reject) => {
    mkdirp(input, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}