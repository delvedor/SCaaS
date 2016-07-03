'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')
const Bcrypt = require('bcrypt')
const Boom = require('boom')
// This should be stored in a db
const user = Object.freeze({
  name: 'Conte Mascetti',
  hash: '$2a$05$zag5NpCaV6/qG.bqt1h6tez8V2TEeyo2J9O4iNiKssMU1iZHQvJda',
  password: 'supersecretpassword' // But not this :P
})
// no-operation
const noop = err => { if (err) throw err }

function build (options, callback) {
  const server = new Hapi.Server()

  callback = callback || noop

  server.connection({
    port: options.port
  })

  server.register(require('hapi-auth-basic'), (err) => {
    if (err) {
      throw err
    }
    server.auth.strategy('simple', 'basic', {
      validateFunc: function (request, username, password, callback) {
        if (username !== user.name) {
          return callback(Boom.unauthorized('Invalid username or password'), false)
        }
        Bcrypt.compare(password, user.hash, (err, isValid) => {
          callback(err ? Boom.unauthorized(err) : null, isValid, { name: user.name })
        })
      }
    })
  })

  server.register([
    {
      register: require('hapi-mongodb'),
      options: {
        url: options.url || 'mongodb://localhost:27017/test'
      }
    },
    require('./lib/insert'),
    require('./lib/fetch')
  ], (err) => {
    callback(err, server)
  })

  return server
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

module.exports = { build, start, user }
