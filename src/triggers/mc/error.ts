import { EmbedBuilder } from 'discord.js'
import { Bot } from 'mineflayer'
import { exit } from 'node:process'
import { discord } from 'platforms'

export default async function (bot: Bot) {
	bot.on('error', async (error) => {
		const embed = new EmbedBuilder()
		embed.addFields({
			name: 'Unexpected Error',
			value: ':yellow_circle: Restarting...'
		})

		embed.addFields({
			name: 'Error',
			value: `\`${error.message}\``
		})

		embed.setColor('#ff4136')
		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(error)
		exit(-2)
	})

	bot.on('end', async (reason) => {
		const embed = new EmbedBuilder()
		embed.addFields({
			name: 'Socket Closed',
			value: ':yellow_circle: Restarting...'
		})

		embed.addFields({
			name: 'Reason',
			value: `\`${reason}\``
		})

		embed.setColor('#ff4136')
		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(reason)
		exit(-2)
	})

	bot.on('kicked', async (reason, _loggedIn) => {
		const embed = new EmbedBuilder()
		embed.addFields({
			name: 'Kicked from Hypixel',
			value: ':yellow_circle: Restarting...'
		})

		embed.addFields({
			name: 'Reason',
			value: `\`${reason}\``
		})

		embed.setColor('#ff4136')
		await discord.webhooks.staff.send({
			embeds: [embed]
		})

		console.log(reason)
		exit(-2)
	})
}
