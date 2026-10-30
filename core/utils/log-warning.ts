// The bundler replaces process.env.NODE_ENV, so this keeps the file compiling
// in projects without @types/node
declare const process: { env: { NODE_ENV?: string } }

const warningStack: { [key: string]: boolean } = {}

const logWarning = (message: string, component?: string) => {
  const tag = component ? ` [${component}]` : ' '
  const log = `[Bolio UI]${tag}: ${message}`

  if (typeof console === 'undefined') return
  if (warningStack[log]) return
  warningStack[log] = true

  if (process.env.NODE_ENV !== 'production') {
    return console.error(log)
  }

  console.warn(log)
}

export default logWarning
