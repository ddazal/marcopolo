import { indexTools } from "./ingest";
import { toolDefinitions } from "./tools/definitions";
import ToolServer from "./server";

async function main() {
  const toolsCollection = await indexTools(toolDefinitions);
  const server = new ToolServer("marcopolo", "1.0.0", toolsCollection);

  await server.run();
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
