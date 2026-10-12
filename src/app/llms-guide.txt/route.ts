import { joinDocs, textResponse } from 'src/app/llms.txt/route'

export const dynamic = 'force-static'

// Guides only (setup, themes, page structure), for a small context window.
export const GET = () => textResponse(joinDocs(['guide']))
