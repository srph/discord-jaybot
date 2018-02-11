const join = require('url-join')

module.exports.public = function public(file) {
  return join('https://storage.googleapis.com', process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME, file)
}