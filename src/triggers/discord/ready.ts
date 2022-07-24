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
				name: 'Party Games',
				url: 'https://tale.me',
				type: 'COMPETING'
			}]
		})

		const chatChannel = bot.channels.cache.get(process.env.DISCORD_CHAT_CHANNEL!) as TextChannel
		if (!chatChannel) {
			console.error('Couldn\'t find chat channel in guild cache')
			process.exit(5)
		}

		for await (const webhook of (await chatChannel.fetchWebhooks()).values()) {
			await webhook.delete('Purging old Kittea Bot webhooks')
		}

		const notifyChannel = bot.channels.cache.get(process.env.DISCORD_NOTIFY_CHANNEL!) as TextChannel
		if (!notifyChannel) {
			console.error('Couldn\'t find notification channel in guild cache')
		}

		let notifyWebhook = (await notifyChannel.fetchWebhooks()).filter(webhook => webhook.name === 'Kittea Bot').first()

		if (!notifyWebhook) {
			notifyWebhook = await notifyChannel.createWebhook('Kittea Bot', {
				avatar: bot.user.displayAvatarURL()
			})
		}

		bot.webhooks = {
			chat: await chatChannel.createWebhook('Kittea Bot', {
				avatar: bot.user.avatarURL()
			}),
			staff: notifyWebhook
		}

		bot.channel = chatChannel

		const { username, discriminator } = bot.user
		console.log('Logged in as %s#%s', username, discriminator)
	})
}
