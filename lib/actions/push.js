const Config = require('configstore')
const chalk = require('chalk')

const config = new Config('VCS')

module.exports = {
  push(git) {
    return require('./pull').pull(git)
      .then(() => { console.log(chalk.cyan(`ready to push ${config.get('status').current}`)) })
      .then(() => git.push('origin', config.get('status').current))
      .then(() => { console.log(chalk.cyan('complete push')) })
  }
}
