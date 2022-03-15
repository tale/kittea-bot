import { Bot } from 'mineflayer'
import { EventEmitter } from 'node:stream'
import { discord } from 'platforms'

export default async function (bot: Bot, emitter: EventEmitter) {
	bot.chatAddPattern(
		/^Guild > (\w{2,17}).*? (joined|left)\.$/,
		'join-leave',
		'Join Leave'
	)

	emitter.on('join-leave', async (username: string, status: 'joined' | 'left') => {
		try {
			await discord.channel.send(`*${username} ${status}*`)
		} catch (err) {
			console.error(err)
		}
	})
}
