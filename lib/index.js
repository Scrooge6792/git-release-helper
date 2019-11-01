const chalk = require('chalk')
const git = require('simple-git/promise')
const inquirer = require('inquirer')

const rootPath = process.cwd()
const args = require('minimist')(process.argv.slice(2))

console.log(chalk.blue.bold(`Release helper works on ${new Date().toLocaleString()}`))
// git(rootPath)
//   .status()
//   .then(status => {
//     if (status.conflicted.length) {
//       console.log(chalk.red(`${status.conflicted.length} conflicted file(s) occur.`))
//       return Promise.reject()
//     } else if (status.files.length === 0) {
//     }
//   })

const steps = [
  { id: 0, name: 'commit to local repo' },
  { id: 1, name: 'push to local repo' },
  { id: 2, name: 'build' },
  { id: 3, name: 'push to released branch' },
  { id: 4, name: 'release a version on remote server' },
]

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Please choose steps',
      name: 'steps',
      choices: steps.map(step => ({ name: step.name }))
    },
  ])
  .then(data => {
    data.steps.map(name => steps.find(step => step.name === name).id)
      // .reduce((run, id) => run(id))
  })
