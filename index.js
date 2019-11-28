#!/usr/bin/env node

const argv = process.argv.slice(2)
const path = require('path')
const chalk = require('chalk')

if (argv.length > 1) {
  console.log('Unknown command')
} else if (argv.length === 0) {
  require('./lib')()
} else {
  switch (argv[0]) {
    case '-v':
      console.log(require('./package').version)
      break
    case 'init':
      require('fs').copyFile(
        path.resolve(__dirname, './lib/default.json'),
        path.resolve(process.cwd(), 'grhconfig.json'),
        (err) => {
          if (err) {
            throw err
          }
          console.log(chalk.greenBright('Successfully initialized'))
        }
      )
      break
    default:
      console.log('Unknown command')
  }
}
