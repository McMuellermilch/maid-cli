const {cosmiconfig} = require('cosmiconfig')
const explorer = cosmiconfig('maid')

export async function searchForConfig(): Promise<any> {
  return explorer.search()
}
