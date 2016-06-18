'use strict'

const Joi = require('joi')

exports.register = function (server, options, next) {
  server.dependency('hapi-mongodb')
  const { db } = server.plugins['hapi-mongodb']
  const collection = db.collection('supercazzola')

  server.route({
    method: 'POST',
    path: '/supercazzola',
    config: {
      validate: {
        payload: Joi.object().keys({
          length: Joi.string().regex(/^long$|^medium$|^short$/).required(),
          supercazzola: Joi.string().required()
        })
      }
    },
    handler: function insertSuperCazzola (request, reply) {
      collection.insert(request.payload, (err, result) => {
        if (err) return reply(err)
        reply(result.ops[0]).code(201)
      })
    }
  })

  next()
}

exports.register.attributes = {
  name: 'supercazzola-insert',
  version: '1.0.0'
}
