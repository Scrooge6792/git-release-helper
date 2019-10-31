const chalk = require('chalk')
const git = require('simple-git/promise')

const rootPath = process.cwd()
const args = require('minimist')(process.argv.slice(2))

console.log(chalk.blue.bold(`Welcome ${new Date().toLocaleString()}`))
// console.log(require('./actions/validator').hasBeenInit)
git(rootPath)
  .status()
  .then(status => {
    if (status.conflicted.length) {
      return Promise.reject()
    }
    console.log(status)
  })
