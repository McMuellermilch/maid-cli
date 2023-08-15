const { cosmiconfig } = require("cosmiconfig");
const explorer = cosmiconfig("maid");

export async function searchForConfig() {
  return await explorer.search();
}
