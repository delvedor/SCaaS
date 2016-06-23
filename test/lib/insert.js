'use strict'

const Lab = require('lab')
const { expect } = require('code')
const { describe, it, beforeEach } = exports.lab = Lab.script()
const { build: buildServer, user } = require('../../server')

const header = 'Basic ' + (new Buffer(user.name + ':' + user.password, 'utf8')).toString('base64')
let server = null

describe('supercazzola-insert', () => {
  beforeEach((done) => {
    server = buildServer({
      port: 8080
    }, (err, s) => {
      if (err) {
        throw err
      }
      server = s
      done()
    })
  })

  it('should return 401', (done) => {
    const expected = {
      length: 'medium',
      supercazzola: 'Supercazzola prematurata con scapezzolamento verso destra'
    }
    server.inject({
      method: 'POST',
      url: '/supercazzola',
      payload: expected
    }, (response) => {
      expect(response.statusCode).to.equal(401)
      done()
    })
  })

  it('should POST /supercazzola', (done) => {
    const expected = {
      length: 'medium',
      supercazzola: 'Supercazzola prematurata con scapezzolamento verso destra'
    }
    server.inject({
      method: 'POST',
      url: '/supercazzola',
      payload: expected,
      headers: {
        authorization: header
      }
    }, (response) => {
      const stored = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(201)
      expect(stored).to.include(expected)
      done()
    })
  })

  it('should return an error/length - /supercazzola', (done) => {
    const expected = {
      length: 'mediumm',
      supercazzola: ''
    }
    server.inject({
      method: 'POST',
      url: '/supercazzola',
      payload: expected,
      headers: {
        authorization: header
      }
    }, (response) => {
      response = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(400)
      expect(response.error).to.equal('Bad Request')
      expect(response.validation.keys).to.equal(['length'])
      done()
    })
  })

  it('should return an error/supercazzola - /supercazzola', (done) => {
    const expected = {
      length: 'short',
      supercazzola: 42
    }
    server.inject({
      method: 'POST',
      url: '/supercazzola',
      payload: expected,
      headers: {
        authorization: header
      }
    }, (response) => {
      response = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(400)
      expect(response.error).to.equal('Bad Request')
      expect(response.validation.keys).to.equal(['supercazzola'])
      done()
    })
  })
})
