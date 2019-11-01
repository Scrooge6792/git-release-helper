const Config = require('configstore')

const config = new Config('VCS')

module.exports = {
  commit(git) {
    if (config.get('status').files.length === 0) {
      return
    }
    return git
      .add('./*')
      .then(() => git.commit(config.get('message')))
  },
}
