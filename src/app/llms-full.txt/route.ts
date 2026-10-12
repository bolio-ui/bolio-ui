import { joinDocs, textResponse } from 'src/app/llms.txt/route'

export const dynamic = 'force-static'

// Every docs page in one file, for assistants that load a single document.
export const GET = () =>
  textResponse(joinDocs(['guide', 'components', 'hooks']))
