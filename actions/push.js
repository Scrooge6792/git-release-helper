const Config = require('configstore')
const chalk = require('chalk')

const config = new Config('VCS')

module.exports = {
  push(git) {
    return require('./pull').pull(git)
      .then(() => git.push('origin', config.get('status').current))
  }
}
