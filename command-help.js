module.exports = function help(message) {
  message.channel.send(
`
Jaybot v1 at your service. Usage:

jaybot go         Display a random image of jayson
jaybot go <text>  Display a random image of Jayson with text.
jaybot help       Display help
`
  )
}