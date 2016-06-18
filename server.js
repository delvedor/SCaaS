'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

function build (options, callback) {
  const server = new Hapi.Server()

  callback = callback || noop

  server.connection({
    port: options.port
  })

  server.register([
    {
      register: require('hapi-mongodb'),
      options: {
        url: options.url || 'mongodb://localhost:27017/test'
      }
    },
    require('./lib/insert')
  ], (err) => {
    callback(err, server)
  })

  return server
}

function noop (err) {
  if (err) {
    throw err
  }
}

function start (options, callback) {
  build(options, (err, server) => {
    if (err) return callback(err, null)
    server.start((err) => {
      callback(err, server)
    })
  })
}

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p'
    },
    default: {
      port: 3000
    }
  }), (err, server) => {
    if (err) {
      throw err
    }
    console.log(`Server running at ${server.info.uri}`)
  })
}

module.exports = { build, start }
