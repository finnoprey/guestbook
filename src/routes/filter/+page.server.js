import filterText from '$lib/server/filter'

export const actions = {
  send: async ({ request }) => {
    const data = await request.formData()
    const text = data.get('text')

    return { 
      filterResult: filterText(text)
    }
  }
}