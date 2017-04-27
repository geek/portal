'use strict';

const GraphqlHapi = require('graphql-server-hapi');
const Data = require('./data');
const Graphql = require('./models/graphql');
const Pack = require('../package.json');
const Routes = require('./routes');


module.exports = function (server, options, next) {
  const data = new Data(options.data);
  server.bind(data);


  server.register([
    {
      register: GraphqlHapi.graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: Graphql.options(data),
        route: {
          cors: true
        }
      }
    }
  ]);

  if (process.env.NODE_ENV === 'dev') {
    server.register({
      register: GraphqlHapi.graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: Graphql.options(data),
        route: {
          cors: true
        }
      }
    });
  }

  server.route(Routes);

  next();
};

module.exports.attributes = {
  name: Pack.name,
  version: Pack.version,
  once: true,
  multiple: false
};
