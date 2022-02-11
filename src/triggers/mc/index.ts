import { Bot } from 'mineflayer'
import { EventEmitter } from 'node:stream'
import guildChat from './guildChat'

type Event = (bot: Bot, emitter: EventEmitter) => Promise<void>
const events: Event[] = [
	guildChat
]

export default events
