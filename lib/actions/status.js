const Config = require('configstore')

const config = new Config('VCS')

module.exports = {
  status(git) {
    return git.status()
      .then(status => {
        config.set('status', status)
        return status
      })
  }
}
