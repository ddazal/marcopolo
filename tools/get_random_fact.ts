import type { ToolDefinition } from "./schema";

export const getRandomFactTool: ToolDefinition = {
  name: "get_random_fact",
  description: "Get random useless fact",
};

export async function getRandomFact() {
  const url = `https://uselessfacts.jsph.pl/api/v2/facts/random`;

  const response = await fetch(url);

  if (response.status !== 200) {
    // TODO: handle error properly
    return [];
  }

  const data = await response.json();
  return data;
}
