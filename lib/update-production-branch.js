const path = require('path')
const Config = require('configstore')
const config = new Config('VCS')

function updateProd(git) {
  return git
    .checkout('prod')
    .then(() => {
      require('./update-bundle')(path.resolve(process.cwd(), './lib'))
    })
    .then(() => require('./actions/commit')(git))
    .then(() => require('./actions/push')(git))
    .then(() => {
      const origin = config.get('targetBranch')
      if (origin) {
        return git.checkout(origin)
      }
    })
}

module.exports = updateProd
