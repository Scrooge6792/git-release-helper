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
  const SSHConfig = require(ifPathExist(baseConfig.SSHConfigPath))
  if (!(SSHConfig.commands && SSHConfig.commands[path.basename(process.cwd())])) {
    throw new Error('Cannot get command from config file.')
  }
  return {
    command: SSHConfig.commands[path.basename(process.cwd())],
    options: SSHConfig.connectionOptions,
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
          const buffer = []
          stream
            .on('close', () => {
              conn.end()
              console.log(console.log(Buffer.concat(buffer).toString('utf-8')))
              resolve()
            })
            .on('data', data => { buffer.push(data) })
          stream.end(config.command)
        })
      })
      .connect(config.options)
  })
}

module.exports = SSHPublish
