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
      return invalid(400, { 
        error: {
          message: 'Please include a name.'
        }
       })
    }

    if (!message) {
      return invalid(400, {
        error: {
          message: 'Please include a message.'
        }
      })
    }

    const filterName = filterText(name)
    const filterMessage = filterText(message)

    if (!filterName.result || !filterMessage.result) {
      return invalid(400, { name, message, error: {
        message: 'Your message or title includes blocked terms.'
      }})
    }

    const entriesCollection = await db.collection('entries')
    await entriesCollection.insertOne({
      name: name,
      message: message
    })
    return { success: true }
  }
}