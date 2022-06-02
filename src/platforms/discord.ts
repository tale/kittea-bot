import { Client, Intents, TextChannel, Webhook } from 'discord.js'
import { discord } from 'triggers'

export class KitteaClient extends Client {
	channel!: TextChannel
	webhooks!: {
		// notify: Webhook
		staff: Webhook
		chat: Webhook
	}

	constructor() {
		super({
			intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES,
			allowedMentions: {
				parse: [] // Disable allowing mentions
			}
		})
	}
}

export const bot = new KitteaClient()

for (const event of discord) {
	await event(bot)
}

await bot.login(process.env.DISCORD_TOKEN!)

