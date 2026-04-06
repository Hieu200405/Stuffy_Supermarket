import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);

// Configure the Gateway to pull from our subgraphs
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'products', url: 'http://localhost:5000/graphql' },
      // Other subgraphs like 'users', 'orders' can be added here in the future
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

const startServer = async () => {
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server) as any
    );

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`[GraphQL Gateway] Running at http://localhost:${PORT}/graphql`);
    });
};

startServer().catch(err => {
    console.error('[GraphQL Gateway] Error during startup:', err);
});
