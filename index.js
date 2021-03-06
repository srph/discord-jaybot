require('dotenv').load()

const Discord = require('discord.js')
const client = new Discord.Client()

const ellipsis = require('./utils/ellipsis')
const log = require('./utils/log')

const dump = require('./dump')
const go = require('./cmd/command-go')
const help = require('./cmd/command-help')

async function main() {
  try {
    await dump()
  } catch(e) {
    log('An error occurred while trying to dump.')
    console.log(e.stack)
    process.exit(0)
  }

  log('The photos were successfully dumped')

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
      case 'go': {
        try {
          await go(message, args)
        } catch(e) {
          console.log(e)
        }
        break
      }

      default: {
        help(message)
        break
      }
    }
  })

  client.login(process.env.DISCORD_BOT_TOKEN)
}

main()