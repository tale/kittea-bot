import {  KitteaClient, mc } from 'platforms'

export default async function (bot: KitteaClient) {
	bot.on('messageCreate', async (message) => {
		if (message.author.bot) {
			return
		}

		if (message.channel.id !== bot.channel.id) {
			return
		}

		if (!message.member) {
			return
		}

		if (!message.guild) {
			return
		}

		// This is all tla's fault and I wouldn't have to do this if it weren't for the incident
		const contents = message.content.normalize().replace('\r\n', ' ').replace('\n', ' ').trim()
		const content = contents.split(' ').flatMap(value => {
			if (value.startsWith('<@') && value.endsWith('>')) {
				// Some mentions have <@! which we need to dynamically slice
				const userID = value.slice(value.startsWith('<@!') ? 3 : 2, -1)
				const user = message.guild!.members.cache.get(userID)

				if (!user) {
					return '@unknown'
				} else {
					return `@${user.displayName}`
				}
			}

			// Parsing channel mentions here
			if (value.startsWith('<#') && value.endsWith('>')) {
				const channelID = value.slice(2, -1)
				const channel = message.guild!.channels.cache.get(channelID)

				if (!channel) {
					return '#unknown'
				} else {
					return `#${channel.name}`
				}
			}

			// Static and animated emojis
			if ((value.startsWith('<:') || value.startsWith('<a:')) && value.endsWith('>')) {
				// Animated emojis start with <:a: so we need to dynamically parse
				const emoji = value.slice(value.startsWith('<a:') ? 3 : 2, -1).split(':')[0]
				return `:${emoji}:`
			}

			return value
		})

		const finalContent = content.join(' ').trim()
		if (finalContent.length === 0) {
			return
		}

		mc.chat(`/gchat >> ${message.member.displayName}: ${finalContent}`)
	})
}
