import { MONGO_URI } from '$env/static/private'
import { MongoClient } from 'mongodb'

const client = new MongoClient(MONGO_URI)
await client.connect()

export default client.db('guestbook')