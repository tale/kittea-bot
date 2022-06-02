import { MessageEmbed } from 'discord.js'
import { Bot } from 'mineflayer'
import { exit } from 'node:process'
import { discord } from 'platforms'

export default async function (bot: Bot) {
	bot.on('error', async (error) => {
		const embed = new MessageEmbed()
		embed.addField('error', error.message)
		embed.setColor('#ff4136')

		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(error)
		exit(-2)
	})
}
