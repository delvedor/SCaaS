'use strict'

const Lab = require('lab')
const { expect } = require('code')
const request = require('request')
const { describe, it } = exports.lab = Lab.script()

const server = require('../server')

describe('server', () => {
  it('should start the server', (done) => {
    server.start({
      port: 8080
    }, (err, serverInstance) => {
      if (err) return done(err)
      request(serverInstance.info.uri, (err, response, body) => {
        if (err) return done(err)
        expect(response.statusCode).to.equal(404)
        done()
      })
    })
  })
})
