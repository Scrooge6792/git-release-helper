const Config = require('configstore')
const config = new Config('VCS')

function gitCommit(git) {
  return require('./status')(git)
    .then(status => {
      if (status.files.length === 0) {
        return
      }
      return git
        .add('./*')
        .then(() => git.commit(config.get('message')))
    })
}

module.exports = gitCommit
