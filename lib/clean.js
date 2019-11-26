const fs = require('fs')
const path = require('path')

function clean(dir) {
  fs.readdirSync(dir)
    .map(file => path.join(dir, file))
    .forEach(pathname => {
      if (fs.statSync(pathname).isDirectory()) {
        clean(pathname)
        fs.rmdirSync(pathname)
      } else {
        fs.unlinkSync(pathname)
      }
    })
}

module.exports = clean
