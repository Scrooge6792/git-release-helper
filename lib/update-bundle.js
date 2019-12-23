const fs = require('fs')
const path = require('path')

const base = process.cwd()

function entireCopy(from, current = from, to = base) {
  return new Promise((resolve, reject) => {
    Promise.all(
      fs.readdirSync(current)
        .map(file => path.resolve(current, file))
        .map(pathname => {
          if (fs.statSync(pathname).isDirectory()) {
            const currentDir = path.resolve(to, path.relative(from, pathname))
            if (from === current) {
              require('./clean')(currentDir)
            }
            if (!fs.existsSync(currentDir)) {
              fs.mkdirSync(currentDir)
            }
            return entireCopy(from, pathname, to)
          }
          return new Promise((resolve1, reject1) => {
            fs.copyFile(
              pathname,
              path.resolve(to, path.relative(from, pathname)),
              err => err ? reject1(err) : resolve1()
            )
          })
        })
    )
      .then(resolve)
      .catch(reject)
  })
}

module.exports = entireCopy
