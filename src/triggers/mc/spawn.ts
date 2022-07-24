import { Bot } from 'mineflayer'

export default async function (bot: Bot) {
	bot.on('spawn', async () => {
		console.log(`Spawned in as ${bot.username}`)
	})
}
