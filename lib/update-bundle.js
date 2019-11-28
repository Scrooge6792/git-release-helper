const fs = require('fs')
const path = require('path')

const base = process.cwd()

function entireCopy(from, current = from, to = base) {
  fs.readdirSync(current)
    .map(file => path.resolve(current, file))
    .forEach(pathname => {
      if (fs.statSync(pathname).isDirectory()) {
        const currentDir = path.resolve(to, path.relative(from, pathname))
        if (from === current) {
          require('./clean')(currentDir)
        }
        if (!fs.existsSync(currentDir)) {
          fs.mkdirSync(currentDir)
        }
        entireCopy(from, pathname, to)
      } else {
        fs.copyFileSync(pathname, path.resolve(to, path.relative(from, pathname)))
      }
    })
}

module.exports = entireCopy
