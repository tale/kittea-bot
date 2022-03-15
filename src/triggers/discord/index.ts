import { KitteaClient } from 'platforms'
import messageCreate from './messageCreate'
import ready from './ready'

type Event = (bot: KitteaClient) => Promise<void>
const events: Event[] = [
	messageCreate,
	ready
]

export default events
