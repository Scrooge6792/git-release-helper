const Config = require('configstore')
const config = new Config('VCS')

function gitStatus(git) {
  return git
    .status()
    .then(status => {
      config.set('status', status)
      return status
    })
}

module.exports = gitStatus
