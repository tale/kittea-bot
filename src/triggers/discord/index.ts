import { KitteaClient } from 'platforms'
import ready from './ready'

type Event = (bot: KitteaClient) => Promise<void>
const events: Event[] = [
	ready
]

export default events
