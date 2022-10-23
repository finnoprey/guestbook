import filterText from '$lib/server/filter'
import { invalid } from '@sveltejs/kit'

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()
    const text = data.get('text')

    if (!text) {
      return invalid(400, { missing_message: true })
    }

    return { 
      filterResult: filterText(text)
    }
  }
}