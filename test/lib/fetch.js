'use strict'

const Lab = require('lab')
const { expect } = require('code')
const { describe, it, beforeEach } = exports.lab = Lab.script()
const { build: buildServer } = require('../../server')
let server = null

describe('supercazzola-fetch', () => {
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

  it('should GET /supercazzola', (done) => {
    server.inject({
      method: 'GET',
      url: '/supercazzola'
    }, (response) => {
      const result = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(200)
      expect(result.length).to.equal(1)
      expect(Array.isArray(result)).to.be.true()
      expect(result[0].length).to.be.a.string().and.to.equal('medium')
      done()
    })
  })

  it('should GET /supercazzola - number 3', (done) => {
    server.inject({
      method: 'GET',
      url: '/supercazzola?number=3'
    }, (response) => {
      const result = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(200)
      expect(result.length).to.equal(3)
      expect(Array.isArray(result)).to.be.true()
      expect(result[0].length).to.be.a.string().and.to.equal('medium')
      expect(result[1].length).to.be.a.string().and.to.equal('medium')
      expect(result[2].length).to.be.a.string().and.to.equal('medium')
      done()
    })
  })

  it('should GET /supercazzola - length medium', (done) => {
    server.inject({
      method: 'GET',
      url: '/supercazzola?length=medium'
    }, (response) => {
      const result = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(200)
      expect(result.length).to.equal(1)
      expect(Array.isArray(result)).to.be.true()
      expect(result[0].length).to.be.a.string().and.to.equal('medium')
      done()
    })
  })

  it('should GET /supercazzola - length long - 404', (done) => {
    server.inject({
      method: 'GET',
      url: '/supercazzola?length=long'
    }, (response) => {
      const result = JSON.parse(response.payload)
      expect(response.statusCode).to.equal(404)
      expect(result.length).to.equal(0)
      expect(Array.isArray(result)).to.be.true()
      done()
    })
  })
})
