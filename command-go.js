module.exports = function go(message, args) {
  const img = pick([
    'https://imgur.com/a/hE2Ra',
    'https://imgur.com/ta4ZI8I',
    'https://imgur.com/J0gndRO'
  ])

  message.channel.send(`Jaybot at your service. ${img}`)
}
