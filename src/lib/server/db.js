import { MONGO_URI, MONGO_DB_NAME } from '$env/static/private'
import { MongoClient } from 'mongodb'

const client = new MongoClient(MONGO_URI)
await client.connect()

export default client.db(MONGO_DB_NAME)