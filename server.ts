import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Collection } from "chromadb";
import z from "zod";
import { getHolidays, type GetHolidaysInput } from "./tools/get_holidays";
import { getRandomFact } from "./tools/get_random_fact";

export default class ToolServer {
  toolsCollection: Collection;
  server: McpServer;

  constructor(name: string, version: string, toolsCollection: Collection) {
    this.server = new McpServer({ name, version });
    this.toolsCollection = toolsCollection;
    this.registerTools()
  }

  registerTools() {
    this.server.registerTool(
      "search_tools",
      {
        title: "Search tools",
        description:
          "Search for available tools that can help with a task. Returns tool definitions for matching tools. Use this when you need a tool but don't have it available yet.",
        inputSchema: {
          query: z
            .string()
            .describe(
              "Natural language description of the capability you need. Include specific details from the user's request (locations, names, IDs, etc.) in your search query - you'll need these values when registering the tool. Example: 'get weather for Seattle' instead of 'get weather', or 'fetch profile for user john@example.com' instead of 'fetch profile', and so on."
            ),
          tool: z
            .object({
              name: z
                .string()
                .optional()
                .describe("The exact name of the tool to register for use"),
              params: z
                .record(z.string(), z.any())
                .optional()
                .describe("Parameters to configure the tool (if applicable)"),
            })
            .optional()
            .describe(
              "Provide this when you've found a tool via search and want to register it for actual use. Leave empty when just searching."
            ),
        },
      },
      async ({ query, tool }) => {
        // If tool is provided, exec
        if (tool?.name) {
          let data
          switch (tool.name) {
            case "get_holidays":
              data = await getHolidays(tool.params as GetHolidaysInput)
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(data)
                  }
                ]
              }
            case "get_random_fact":
              data = await getRandomFact()
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(data)
                  }
                ]
              }
            default:
              return {
                content: [
                  {
                    type: "text",
                    text: "Unknown tool"
                  }
                ]
              }
          }
        }
        const matches = await this.toolsCollection.query({
          queryTexts: [query],
          nResults: 5,
        });

        const toolResults = matches.rows().map((row) => {
          const toolId = row[0]?.id;
          const description = row[0]?.document;
          const metadata = row[0]?.metadata
          const distance = row[0]?.distance;

          return {
            name: toolId,
            description: description || "No description available",
            relevanceScore: (1 - (distance || 0)).toFixed(3),
            parameters: metadata?.parameters
          };
        });

        if (toolResults.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No tools found matching: "${query}". Try rephrasing your search.`,
              },
            ],
          };
        }

        const resultTextParts = [
          `Found ${toolResults.length} matching tool(s) for: "${query}`,
        ];

        toolResults.forEach((tool, idx) => {
          const def = `
          ${idx + 1}. **${tool.name}** (relevance: ${tool.relevanceScore})
          
          ${tool.description}
          
          To use this tool, call search_tools again with:
          {
            "query": "${query}",
            "tool": {
              "name": "${tool.name}",
              "params": {
                
              }
            }
          }
          Note: The "params" object should be populated to contain key-value pairs where keys match the parameter names listed in the tool parameters
          
          ${tool.parameters}. 
          `;
          resultTextParts.push(def)
        });

        const resultText = resultTextParts.join('\n')
        
        return { content: [{ type: "text", text: resultText }] };
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
