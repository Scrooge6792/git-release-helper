const chalk = require('chalk')
const git = require('simple-git/promise')(process.cwd())
const inquirer = require('inquirer')
const Config = require('configstore')
const Spinner = require('clui').Spinner
const config = new Config('VCS')

console.log(chalk.blue.bold(`Release helper works on ${new Date().toLocaleString()}`))

const steps = [
  { id: 0, name: 'commit to local repo' },
  { id: 1, name: 'push to remote repo' },
  { id: 2, name: 'build' },
  { id: 3, name: 'push bundles to released branch' },
  { id: 4, name: 'release a version on remote server' },
]
const stepsOnlyName = steps.map(step => ({ name: step.name }))
const actions = new Map([
  [0, require('./actions/commit')],
  [1, require('./actions/push')],
  [2, require('./actions/build')],
  [3, require('./update-production-branch')],
  [4, require('./ssh')]
])

const spinner = new Spinner('')
function spinnerText(step) {
  const current = (n => n >= 0 ? n : 0)(step || config.get('currentStep') || 1)
  const userOptions = config.get('userOptions')
  return `[${current}/${userOptions.length}] ${steps.find(step => step.id === userOptions[current - 1]).name}...`
}
function updateSpinner() {
  const step = (config.get('currentStep') || 0) + 1
  config.set('currentStep', step)
  spinner.message(spinnerText(step))
}

function reset() {
  config.delete('targetBranch')
  config.delete('status')
}

function run() {
  return inquirer
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
          .then(({ message }) => {
            spinner.start()
            config.set('message', message)
          })
          .then(() => options)
      }
      return options
    })
    .then(options => {
      config.set('currentStep', 0)
      return options.reduce(
        (promise, id) => {
          return promise
            .then(() => { updateSpinner() })
            .then(() => actions.get(id)(git))
        },
        git.fetch().then(() => require('./actions/status')(git))
      )
    })
    .then(() => {
      spinner.stop()
      console.log(chalk.greenBright('Done.'))
    })
    .then(() => {
      reset()
      process.exit(0)
    })
    .catch(err => {
      console.error(err)
      reset()
      process.exit(1)
    })
}

module.exports = run
