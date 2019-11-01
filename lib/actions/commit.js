module.exports = {
  commit(status, git) {
    if (status.files.length === 0) {
      return
    }
    return git
      .add('./*')
      .then(() => git.commit())
  },
}
