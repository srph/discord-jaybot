const log = require('../utils/log')

module.exports = function help(message) {
  message.channel.send(log.channel(`Usage:

jaybot go         Display a random image of jayson
jaybot go <text>  Display a random image of Jayson with text.
jaybot help       Display help
`
  ))
}