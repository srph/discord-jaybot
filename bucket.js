const Storage = require('@google-cloud/storage')
module.exports = new Storage().bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME)