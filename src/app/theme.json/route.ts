import light from 'core/Themes/Presets/Default'
import dark from 'core/Themes/Presets/Dark'

export const dynamic = 'force-static'

// The theme tokens as data, for the MCP server and for anyone who needs the
// values without importing the library. Built from the presets themselves.
export const GET = () => Response.json({ light, dark })
