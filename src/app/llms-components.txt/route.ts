import { joinDocs, textResponse } from 'src/app/llms.txt/route'

export const dynamic = 'force-static'

// Components and hooks only, for assistants with a small context window.
export const GET = () => textResponse(joinDocs(['components', 'hooks']))
