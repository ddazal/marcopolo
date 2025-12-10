import { indexTools } from "./ingest"
import { toolDefinitions } from "./tools/definitions"

await indexTools(toolDefinitions)

await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./build",
    target: "node",
})