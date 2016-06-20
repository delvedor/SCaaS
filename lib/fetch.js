'use strict'

const Joi = require('joi')

exports.register = function (server, options, next) {
  server.dependency['hapi-mongodb']
  const { db } = server.plugins['hapi-mongodb']
  const collection = db.collection('supercazzola')

  server.route({
    method: 'GET',
    path: '/supercazzola',
    config: {
      validate: {
        query: Joi.object().keys({
          length: Joi.string().default('medium'),
          number: Joi.number().default(1)
        })
      }
    },
    handler: function fetchSuperCazzola (request, reply) {
      collection
        .find({
          length: request.query.length
        }, { _id: 0 })
        .limit(request.query.number)
        .toArray((err, results) => {
          if (err) return reply(err)
          reply(results).code(results.length ? 200 : 404)
        })
    }
  })

  next()
}

exports.register.attributes = {
  name: 'supercazzola-fetch',
  version: '1.0.0'
}
