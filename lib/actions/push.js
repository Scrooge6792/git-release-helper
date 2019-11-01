const Config = require('configstore')
const chalk = require('chalk')

const config = new Config('VCS')

module.exports = {
  push(git) {
    return git
      .branch(['-a'])
      .then(branch => branch.all.includes(`remotes/origin/${branch.current}`) ? Promise.resolve(branch.current) : Promise.reject())
      .then(branch => git.pull('origin', branch))
      .catch(() => {})
      .then(() => require('./status').status(git))
      .then(status => {
        if (status.conflicted.length) {
          console.log(chalk.red(`${status.conflicted.length} conflicted file${status.conflicted.length > 1 ? '(s)' : ''} occur.`))
          process.exit()
        } else {
          return git.push('origin', status.current)
        }
      })
  }
}
