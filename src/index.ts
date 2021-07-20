import { Client, Guild, MessageEmbed, TextChannel, Webhook } from 'discord.js'
import { createBot } from 'mineflayer'

if (!process.env.DISCORD_TOKEN) {
	console.error('Missing Discord token')
	process.exit(1)
}

if (!process.env.DISCORD_CHANNEL) {
	console.error('Missing Discord channel ID')
	process.exit(1)
}

if (!process.env.MC_EMAIL) {
	console.error('Missing Minecraft email')
	process.exit(2)
}

if (!process.env.MC_PASSWORD) {
	console.error('Missing Minecraft password')
	process.exit(3)
}

// Minecraft bot
const bot = createBot({
	username: process.env.MC_EMAIL,
	password: process.env.MC_PASSWORD,
	host: 'mc.hypixel.net',
	viewDistance: 'tiny'
})

bot.on('login', async() => {
	// This message sends to limbo
	bot.chat('/ac \u00a7')

	await bot.waitForChunksToLoad()
	console.log('Connected:', bot.username)
})

// Recreate the bot on any errors
bot.on('kicked', (reason) => {
	console.log('Kicked:', reason)
	bot.connect({
		username: process.env.MC_EMAIL!,
		password: process.env.MC_PASSWORD,
		host: 'mc.hypixel.net',
		viewDistance: 'tiny'
	})
})

bot.on('death', () => {
	console.log('Experienced Death')
	bot.connect({
		username: process.env.MC_EMAIL!,
		password: process.env.MC_PASSWORD,
		host: 'mc.hypixel.net',
		viewDistance: 'tiny'
	})
})

bot.on('error', (err) => {
	console.log('Error:', err.message)
	bot.connect({
		username: process.env.MC_EMAIL!,
		password: process.env.MC_PASSWORD,
		host: 'mc.hypixel.net',
		viewDistance: 'tiny'
	})
})

bot.on('chat', async (chat, rawLine) => {
	if (rawLine.length <= 0) {
		return
	}

	if (chat !== 'Guild') {
		return
	}

	if (rawLine.includes('joined') || rawLine.includes('left')) {
		const username = rawLine.split(' ')[0]

		// I could split this into 2 checks but I'm lazy
		const action = rawLine.includes('joined') ? 'joined' : 'left'

		const embed = new MessageEmbed({
			fields: [{
				name: username,
				value: `${action} Hypixel`,
				inline: true
			}],
			thumbnail: {
				url: `https://mc-heads.net/avatar/${username}/48`
			}
		})

		webhook.send(embed)
		return
	}

	// We need to ignore the chat delimiter and then get the bit after a potential rank
	// Ranks are wrapped in brackets: [MVP+] and the chat delimiter is always :
	const username = rawLine.split(':')[0].split(' ')[rawLine.startsWith('[') ? 1 : 0]
	if (username == bot.username) {
		return
	}

	const message = rawLine.split(':')[1]

	try {
		await webhook.send(message, {
			username: username,
			avatarURL: `https://mc-heads.net/avatar/${username}/256`,
			disableMentions: 'everyone'
		})
	} catch (err) {
		console.error(err)
	}
})

// Discord bot
let webhook: Webhook
let guild: Guild
const client = new Client({
	disableMentions: 'all'
})
client.login(process.env.DISCORD_TOKEN)

client.on('ready', async () => {
	if (!client.user) {
		console.error('No Discord user')
		process.exit(4)
	}

	console.log('Logged in:', `${client.user?.username}#${client.user?.discriminator}`)
	const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL!) as TextChannel
	if (!channel) {
		console.error('Couldn\'t find channel in guild cache')
		process.exit(5)
	}

	const webhooks = await channel.fetchWebhooks()
	for await (const webhook of webhooks.values()) {
		await webhook.delete('Purging old Kittea Bot webhooks')
	}

	webhook = await channel.createWebhook('Kittea Bot', {
		avatar: client.user.avatarURL()!
	})

	let searchGuild = client.guilds.cache.get(webhook.guildID)
	if (!searchGuild) {
		console.error('Couldn\'t find guild in cache')
		process.exit(6)
	}

	guild = searchGuild

	await client.user.setStatus('idle')
	await client.user.setActivity({
		name: 'food',
		type: 'WATCHING'
	})
})

client.on('message', (message) => {
	if (message.author.bot) {
		return
	}

	if (message.channel.id !== webhook.channelID) {
		return
	}

	if (!message.member) {
		return
	}

	const content = message.content.split(' ').flatMap(value => {
		if (value.startsWith('<@') && value.endsWith('>')) {
			// Some mentions have <@! which we need to dynamically slice
			const userID = value.slice(value.startsWith('<@!') ? 3 : 2, -1)
			const user = guild.member(userID)

			if (!user) {
				return '@unknown'
			} else {
				return `@${user.displayName}`
			}
		}

		// Parsing channel mentions here
		if (value.startsWith('<#') && value.endsWith('>')) {
			const channelID = value.slice(2, -1)
			const channel = guild.channels.cache.get(channelID)

			if (!channel) {
				return '#unknown'
			} else {
				return `#${channel.name}`
			}
		}

		// Static and animated emojis
		if ((value.startsWith('<:') || value.startsWith('<a:') )&& value.endsWith('>')) {
			// Animated emojis start with <:a: so we need to dynamically parse
			const emoji = value.slice(value.startsWith('<a:') ? 3 : 2, -1).split(':')[0]
			return `:${emoji}:`
		}

		return value
	})

	bot.chat(`>> ${message.member.displayName}: ${content.join(' ')}`)
})

client.on('error', (err) => {
	console.error(err.message)
})
