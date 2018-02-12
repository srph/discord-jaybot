const rf = require('rimraf')

module.exports = function promisifiedRimraf(input) {
  return new Promise((resolve, reject) => {
    rf(input, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}