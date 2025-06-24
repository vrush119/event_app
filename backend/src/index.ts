import express from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // You can add authentication logic here if needed
    return { prisma, io, req };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (eventId) => {
      socket.join(eventId);
    });
  });

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Socket.io ready at http://localhost:${PORT}`);
  });
}

startServer();