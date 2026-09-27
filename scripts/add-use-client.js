// Every component reads the theme through context, so all of them are Client
// Components. Marking the entry files lets Server Components (Next App Router)
// import them without adding 'use client' in the app.
const { join } = require('path')
const { existsSync } = require('fs')
const fs = require('fs/promises')

const root = join(__dirname, '..')
const directive = "'use client';\n"

;(async () => {
  for (const folder of ['dist', 'esm']) {
    const base = join(root, folder)
    const entries = [join(base, 'index.js')]
    for (const name of await fs.readdir(base)) {
      const entry = join(base, name, 'index.js')
      if (existsSync(entry)) entries.push(entry)
    }

    await Promise.all(
      entries.map(async (file) => {
        const content = await fs.readFile(file, 'utf8')
        if (!content.startsWith(directive)) {
          await fs.writeFile(file, directive + content)
        }
      })
    )
    console.log(`[${folder}]> 'use client' added to ${entries.length} entries.`)
  }
})().catch((err) => {
  console.log(err)
  process.exit(1)
})
