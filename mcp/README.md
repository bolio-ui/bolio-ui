# @bolio-ui/mcp

MCP server that gives AI assistants the [Bolio UI](https://bolio-ui.com) documentation. It uses the stdio transport and reads the pages that bolio-ui.com publishes as Markdown, so it needs no API key.

```bash
# Claude Code
claude mcp add bolio-ui -- npx -y @bolio-ui/mcp@latest
```

For Cursor, Windsurf, Zed, VS Code, Codex and OpenCode, see the [MCP Server guide](https://bolio-ui.com/docs/guide/mcp-server).

## Tools

| Tool                  | What it does                                                                 |
| --------------------- | ---------------------------------------------------------------------------- |
| `list_components`     | lists the components, with a summary of each                                 |
| `list_hooks`          | lists the hooks, with a summary of each                                      |
| `get_component_docs`  | docs of one or more components: props, examples and usage                    |
| `get_theme_variables` | theme tokens of the light theme, the dark theme or both                      |
| `get_docs`            | one page by path, such as `guide/getting-started`; without a path, the index |

It needs Node.js 18 or higher. Set `BOLIO_UI_URL` to read the docs from another address, for example `http://localhost:3000` while you work on them.
