const git = require('simple-git')

module.exports = {
  hasBeenInit: git.status
}
