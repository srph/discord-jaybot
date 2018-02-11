## discord-jaybot
Post random fancy photos of the one and only Jayson.

## Commands
- `!jaybot` &mdash; Help
- `!jaybot go` &mdash; Pick and post a random photo of Jayson
- `!jaybot go hello` &mdash; Pick and post a random photo of Jayson, with "hello" text

## Setup
Requires Node `>v7.10` & npm `>=v5`.

- Clone the repository and run `npm install`.
- Copy `.env.example` to `.env` and open up `.env`
  - Setup your [bot's token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).
  - Set `DISCORD_BOT_TOKEN` to your bot's token.
  - Create a [Google Cloud Storage](https://cloud.google.com/storage/) bucket.
  - Set `GOOGLE_CLOUD_STORAGE_BUCKET_NAME` to your GCS bucket name.
  - Setup [Google Cloud Storage](https://www.npmjs.com/package/@google-cloud/storage#before-you-begin).
  - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path to your GCS configuration.
- Start the bot with `npm start`.
