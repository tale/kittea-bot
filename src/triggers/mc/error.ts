import { MessageEmbed } from 'discord.js'
import { Bot } from 'mineflayer'
import { exit } from 'node:process'
import { discord } from 'platforms'

export default async function (bot: Bot) {
	bot.on('error', async (error) => {
		const embed = new MessageEmbed()
		embed.addField('Unexpected Error', ':yellow_circle: Restarting...')
		embed.addField('Error', `\`${error.message}\``)
		embed.setColor('#ff4136')

		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(error)
		exit(-2)
	})

	bot.on('end', async (reason) => {
		const embed = new MessageEmbed()
		embed.addField('Socket Ended', ':yellow_circle: Restarting...')
		embed.addField('Error', `\`${reason}\``)
		embed.setColor('#ff4136')

		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(reason)
		exit(-2)
	})

	bot.on('kicked', async (reason, loggedIn) => {
		const embed = new MessageEmbed()
		embed.addField('Kicked from Hypixel', ':yellow_circle: Restarting...')
		embed.addField('Error', `\`${reason}\``)
		embed.setColor('#ff4136')

		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(reason)
		exit(-2)
	})
}
