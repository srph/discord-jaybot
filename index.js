require('dotenv').load()

const Discord = require('discord.js')
const client = new Discord.Client()

const ellipsis = require('./ellipsis')
const log = require('./log')
const go = require('./command-go')
const help = require('./command-help')
const util = require('util')

client.on('ready', () => {
  log('Connected to discord...')
})

client.on('message', async message => {
  if (message.author.bot) {
    return
  }

  const args = message.content.trim().split(/ +/g)
  const command = args.length ? args.shift().toLowerCase() : ''

  if (command !== '!jaybot') {
    return
  }

  log(`Received from ${message.author.username} - ${ellipsis(message.content)}`)

  const job = args.length ? args.shift().toLowerCase() : ''

  switch(job) {
    case 'go':
      try {
        console.log(process.env)
        await go(message, args)
      } catch(e) {
        console.log(e)
      }
      break
    default:
      help(message)
      break
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)