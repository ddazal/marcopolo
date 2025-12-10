import { z } from "zod";

const toolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z
    .object({
      properties: z.record(
        z.string(),
        z.object({
          type: z.string(),
          description: z.string(),
          enum: z.array(z.string()).optional(),
          default: z.string().optional(),
        })
      ),
      required: z.array(z.string()),
    })
    .refine(
      (params) => {
        const propertyKeys = Object.keys(params.properties);
        return params.required.every((key) => propertyKeys.includes(key));
      },
      {
        message: "All fields in 'required' must exist in 'properties'",
      }
    ).optional(),
});

export type ToolDefinition = z.infer<typeof toolSchema>;

type ToolDescription = {
    text: string
    inputSchema?: string
}

export function describeTool(toolDef: ToolDefinition): ToolDescription {
  const result: ToolDescription = {
    text: [`Tool: ${toolDef.name}`, `Description: ${toolDef.description}`].join('\n'),
  }
  if (toolDef.parameters) {
    result.inputSchema = JSON.stringify(toolDef.parameters)
  }
  return result
}