import { Bot } from 'mineflayer'
import { EventEmitter } from 'node:stream'
import error from './error'
import guildChat from './guildChat'
import guildJoinLeave from './guildJoinLeave'

type Event = (bot: Bot, emitter: EventEmitter) => Promise<void>
const events: Event[] = [
	guildChat,
	guildJoinLeave,
	error
]

export default events
