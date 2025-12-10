# marcopolo

To install dependencies:

```bash
bun install
```

Run Chroma server:

```bash
bunx chroma run
```

Build:
```
bun run build
````

Add to MCP client configuration
```
{
    "mcpServers": {
        "marcopolo": {
            "command": "node",
            "args": [
                "/path/to/build/index.js"
            ],
            "env": {
                "OPENAI_API_KEY": ""
            }
        }
    }
}
```

**Note:** chroma server must be running.

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
