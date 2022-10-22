import db from '$lib/server/db'
import filterText from '$lib/server/filter'
import { invalid } from '@sveltejs/kit'

export async function load({ params }) {
  const entriesCollection = await db.collection('entries')
  const entries = await entriesCollection.find().toArray()

  // replace non-pojo property (ObjectId) with a string for serialization
  entries.forEach(e => e._id = e._id.toString())

  return {
    entries: entries.reverse(),
  }
}

export const actions = {
  send: async ({ request }) => {
    const data = await request.formData()
    const name = data.get('name')
    const message = data.get('message')

    if (!name) {
      return invalid(400, { name, message, missing_name: true })
    }

    if (!message) {
      return invalid(400, { name, message, missing_message: true })
    }

    const entriesCollection = await db.collection('entries')
    await entriesCollection.insertOne({
      name: name,
      message: message
    })
    return { success: true }
  }
}