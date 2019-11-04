const Config = require('configstore')
const chalk = require('chalk')

const config = new Config('VCS')

module.exports = {
  push(git) {
    return git
      .branch(['-a'])
      .then(branch => {
        return branch.all.includes(`remotes/origin/${branch.current}`)
          && config.get('status').behind > 0
          ? branch.current
          : Promise.reject()
      })
      .then(branch => {
        return git
          .pull('origin', branch)
          .then(() => require('./status').status(git))
          .then(status => {
            if (status.conflicted.length) {
              console.log(chalk.red(`${status.conflicted.length} conflicted file${status.conflicted.length > 1 ? '(s)' : ''} occur.`))
              return Promise.reject(new Error('merge conflicted'))
            }
          })
      })
      .catch(() => {})
      .then(() => { console.log(chalk.cyan(`ready to push ${config.get('status').current}`)) })
      // .then(() => git.push('origin', config.get('status').current))
      .then(() => { console.log(chalk.cyan('complete push')) })
  }
}
