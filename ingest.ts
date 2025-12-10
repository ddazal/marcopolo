import type { Collection, Metadata } from "chromadb";
import { describeTool, type ToolDefinition } from "./tools/definitions";
import { getCollection } from "./collections";

export async function indexTools(tools: ToolDefinition[]): Promise<Collection> {
  const toolsCollection = await getCollection("tools");

  const collectionData = tools.reduce<{
    ids: string[];
    documents: string[];
    metadatas: Metadata[];
  }>(
    (acc, tool) => {
      const id = tool.name;
      const desc = describeTool(tool);

      acc.ids.push(id);
      acc.documents.push(desc.text);
      acc.metadatas.push({ parameters: desc.inputSchema || '' });

      return acc;
    },
    { ids: [], documents: [], metadatas: [] }
  );

  await toolsCollection.add(collectionData);

  return toolsCollection;
}
