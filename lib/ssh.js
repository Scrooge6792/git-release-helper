const Client = require('ssh2').Client
const { Buffer } = require('buffer')

const conn = new Client()

conn
  .on('error', err => {
    console.log(err)
    conn.end()
  })
  .on('ready', () => {
    console.log('connect')
    conn.shell((err, stream) => {
      if (err) {
        throw err
      }
      stream
        .on('close', () => {
          console.log('stream close')
          conn.end()
        })
        .on('data', data => { console.log(Buffer.concat([data]).toString('utf-8')) })
      // stream.end('cd /srv/http/CreditIntegralTrade/app/admin && ls')
      stream.end('cd /srv/http/CreditIntegralTrade/app/admin && ls\nexit\n')
    })
  })
  .connect()
