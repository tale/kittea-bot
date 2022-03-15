import { TextChannel } from 'discord.js'
import { KitteaClient } from 'platforms'

export default async function (bot: KitteaClient) {
	bot.on('ready', async () => {
		if (!bot.user) {
			return
		}

		bot.user.setPresence({
			status: 'online',
			activities: [{
				name: 'Bedwars',
				url: 'https://tale.me',
				type: 'COMPETING'
			}]
		})

		const channel = bot.channels.cache.get(process.env.DISCORD_CHANNEL!) as TextChannel
		if (!channel) {
			console.error('Couldn\'t find channel in guild cache')
			process.exit(5)
		}

		const webhooks = await channel.fetchWebhooks()
		for await (const webhook of webhooks.values()) {
			await webhook.delete('Purging old Kittea Bot webhooks')
		}

		bot.webhooks = {
			chat: await channel.createWebhook('Kittea Bot', {
				avatar: bot.user.avatarURL()
			})
		}

		bot.channel = channel

		const { username, discriminator } = bot.user
		console.log('Logged in as %s#%s', username, discriminator)
		await channel.send(':yellow_circle: Restarting...')
	})
}
