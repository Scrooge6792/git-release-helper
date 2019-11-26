const { spawn } = require('child_process')
const { Buffer } = require('buffer')

function deferred() {
  const d = {}
  d.promise = new Promise(((resolve, reject) => {
    d.resolve = resolve
    d.reject = reject
  }))
  return d
}

function customSpawn(command, args) {
  const spawned = spawn(command, args, {
    cwd: process.cwd(),
    windowsHide: true
  })

  const stdOut = []
  const stdErr = []
  const result = deferred()

  let attempted = false
  const attemptClose = function attemptClose(e) {
    if (attempted || stdOut.length || stdErr.length) {
      result.resolve(e)
      attempted = true
    }
    if (!attempted) {
      attempted = true
      setTimeout(() => { attemptClose(e) }, 50)
    }
  }

  spawned.stdout.on('data', buffer => { stdOut.push(buffer) })
  spawned.stderr.on('data', buffer => { stdErr.push(buffer) })
  spawned.on('error', err => { stdErr.push(Buffer.from(err.stack, 'ascii')) })
  spawned.on('close', attemptClose)
  spawned.on('exit', attemptClose)

  return result.promise.then(code => {
    if (code) {
      const msg = Buffer.concat(stdErr).toString('utf-8')
      console.error(msg)
      return Promise.reject({ code, msg })
    }
  })
}

module.exports = customSpawn
