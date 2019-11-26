const Config = require('configstore')
const chalk = require('chalk')
const config = new Config('VCS')

function gitPush(git) {
  return require('./pull')(git)
    .then(() => git.push('origin', config.get('status').current))
}

module.exports = gitPush
