const Discord = require('discord.js')
const client = new Discord.Client()
const ellipsis = require('./ellipsis')
const log = require('./log')
const pick = require('./pick')
const go = require('./command-go')
const help = require('./command-help')

client.on('ready', () => {
  log('Connected to discord...')
})

client.on('message', async message => {
  if (message.author.bot) {
    return
  }

  const args = message.content.trim().split(/ +/g)
  const command = args.length ? args.shift().toLowerCase() : ''

  if (command !== 'jaybot') {
    return
  }

  log(`Received from ${message.author.username} - ${ellipsis(message.content)}`)

  const job = args.length ? args.shift().toLowerCase() : ''

  switch(job) {
    case 'go':
      go(message, args)
      break
    default:
      help(message)
      break
  }
})

client.login('NDEyMDI1NDY1ODIyMzgwMDQy.DWEStA.EACbZQ3l3kF0hr7Usmb9BrDP-_s')