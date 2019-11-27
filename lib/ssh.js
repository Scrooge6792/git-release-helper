const Client = require('ssh2').Client
const { Buffer } = require('buffer')
const path = require('path')
const fs = require('fs')

function ifPathExist(dir) {
  if (fs.existsSync(dir)) {
    return dir
  }
  throw new Error(`Cannot find grhconfig.json in ${process.cwd()}`)
}

function getConfig() {
  const baseConfig = require(ifPathExist(path.resolve(process.cwd(), 'grhconfig.json')))
  return {
    command: baseConfig.command,
    options: require(ifPathExist(baseConfig.SSHConfigPath)),
  }
}

function SSHPublish() {
  const conn = new Client()
  const config = getConfig()
  return new Promise((resolve, reject) => {
    conn
      .on('error', err => {
        console.log(err)
        conn.end()
        reject(err)
      })
      .on('ready', () => {
        conn.shell((err, stream) => {
          if (err) {
            reject(err)
            throw err
          }
          stream
            .on('close', () => {
              conn.end()
              resolve()
            })
            .on('data', data => { console.log(Buffer.concat([data]).toString('utf-8')) })
          stream.end(config.command)
        })
      })
      .connect(config.options)
  })
}

module.exports = SSHPublish
