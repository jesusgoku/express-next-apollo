import express from 'express';
import Next from 'next';
import { ApolloServer, gql } from 'apollo-server-express';

const isDev = process.env.NODE_ENV !== 'production';

const app = express();

// Next bootstrap
const next = Next({ dev: isDev });
const handle = next.getRequestHandler();

// Apollo bootstrap
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.get('/hello', (req, res) => res.send('Hello World'));
app.get('*', (req, res) => handle(req, res));

(async () => {
  try {
    await next.prepare();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, err => {
    if (err) {
      throw err;
    }

    console.log('Ready on http://localhost:3000');
  });
})();
