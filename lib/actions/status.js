const Config = require('configstore')
const config = new Config('VCS')

function gitStatus(git) {
  return git
    .status()
    .then(status => {
      config.set('status', status)
      if (!config.get('targetBranch')) {
        config.set('targetBranch', status.current)
      }
      return status
    })
}

module.exports = gitStatus
