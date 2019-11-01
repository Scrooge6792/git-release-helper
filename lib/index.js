const chalk = require('chalk')
const git = require('simple-git/promise')(process.cwd())
const inquirer = require('inquirer')
const Config = require('configstore')
const Spinner = require('clui').Spinner
const rootPath = process.cwd()
const args = require('minimist')(process.argv.slice(2))
const config = new Config('VCS')

console.log(chalk.blue.bold(`Release helper works on ${new Date().toLocaleString()}`))
// git(rootPath)
//   .status()
//   .then(status => {
//     console.log(status)
//     if (status.conflicted.length) {
//       console.log(chalk.red(`${status.conflicted.length} conflicted file(s) occur.`))
//       return Promise.reject()
//     } else if (status.files.length === 0) {
//       console.log(chalk.green('no file changes'))
//     }
//   })

// git.status()
//   .then(remotes => {
//     console.log(remotes)
//   })

const steps = [
  { id: 0, name: 'commit to local repo' },
  { id: 1, name: 'push to remote repo' },
  { id: 2, name: 'build' },
  { id: 3, name: 'push bundles to released branch' },
  { id: 4, name: 'release a version on remote server' },
]
const stepsOnlyName = steps.map(step => ({ name: step.name }))

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Please choose steps',
      name: 'steps',
      choices: stepsOnlyName,
      default: stepsOnlyName.map(step => step.name),
      validate: answer => answer.length > 0 || 'You must choose at least one step.',
    },
  ])
  .then(data => {
    const userOptions = data.steps.map(name => steps.find(step => step.name === name).id)
    config.set('userOptions', userOptions)
    return userOptions
  })
  .then(options => {
    /* include push step */
    if (options.includes(0) || options.includes(3)) {
      return inquirer
        .prompt([
          {
            type: 'input',
            message: "What's the commit message?",
            name: 'message',
            default: 'update',
          }
        ])
        .then(({ message }) => { config.set('message', message) })
        .then(() => options)
    }
    return options
  })
  .then(options => {
    const actions = new Map([
      [0, require('./actions/commit').commit],
      [1, require('./actions/push').push],
    ])
    return options.reduce((promise, id) => {
      return promise.then(() => actions.get(id)(git))
    }, git.fetch().then(() => require('./actions/status').status(git)))
  })
  .then(() => { console.log(chalk.green('Release successful!')) })
