import { Bot } from 'mineflayer'
import { EventEmitter } from 'node:stream'
import { discord } from 'platforms'

enum Chat {
	Guild = 'Guild',
	Officer = 'Officer'
}

export default async function (bot: Bot, emitter: EventEmitter) {
	bot.chatAddPattern(
		/^(Guild|Officer) > (\[.*]\s*)?(\w{2,17}).*?(\[.{1,15}])?: (.*)$/,
		'guild-chat',
		'Guild Chat'
	)

	emitter.on('guild-chat', async (chat: Chat, rank: string, username: string, role: string, message: string) => {
		console.log(chat, message, rank, username, role)
		try {
			await discord.webhooks.chat.send({
				content: message,
				username: username,
				avatarURL: `https://mc-heads.net/avatar/${username}/256`
			})
		} catch (err) {
			console.error(err)
		}
	})
}
