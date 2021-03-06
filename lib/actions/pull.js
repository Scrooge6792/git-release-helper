const Config = require('configstore')
const chalk = require('chalk')
const config = new Config('VCS')

function gitPull(git) {
  return git
    .branch(['-a'])
    .then(branch => {
      if (branch.all.includes(`remotes/origin/${branch.current}`)) {
        return git
          .pull('origin', branch.current)
          .then(() => require('./status')(git))
          .then(status => {
            if (status.conflicted.length) {
              console.log(chalk.red(`${status.conflicted.length} conflicted file${status.conflicted.length > 1 ? '(s)' : ''} occur.`))
              return Promise.reject(new Error('merge conflicted'))
            }
          })
      }
    })
}

module.exports = gitPull
