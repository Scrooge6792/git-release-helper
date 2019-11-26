const spawn = require('../spawn')

function build() {
  return spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'])
    .catch(err => Promise.reject(`build fail with code ${err.code}`))
}

module.exports = build
