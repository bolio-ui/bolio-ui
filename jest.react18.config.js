const base = require('./jest.config.js')

// Runs the same tests against a separate React 18 install, mapped in place
// of the repo's own react/react-dom (a dev dependency on React 19). Kept
// only in compat/.work (git-ignored); run `npm install` there first if
// missing, or use `yarn test:react18`, which does it.
const root = '<rootDir>/compat/.work/react18/node_modules'

module.exports = {
  ...base,
  moduleNameMapper: {
    '^react$': `${root}/react`,
    '^react-dom$': `${root}/react-dom`,
    '^react-dom/(.*)$': `${root}/react-dom/$1`,
    '^react/(.*)$': `${root}/react/$1`
  }
}
