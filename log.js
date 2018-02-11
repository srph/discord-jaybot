module.exports = log

function log(message) {
  console.log(`[JAYBOT]: ${message}`)
}

log.channel = function channel(message) {
  return `Jaybot v1 at your service. ${message}`
}