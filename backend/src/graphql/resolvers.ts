import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const resolvers = {
  Query: {
    events: async () => prisma.event.findMany({ include: { attendees: true } }),
    me: async (_: any, __: any, { req }: any) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return null;
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return prisma.user.findUnique({ where: { id: decoded.userId } });
      } catch {
        return null;
      }
    },
  },
  Mutation: {
    login: async (_: any, { username, password }: any) => {
      // Find user by email (username)
      const user = await prisma.user.findUnique({ where: { email: username } });
      // Check if user exists and password matches
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      // Return JWT with real user ID
      return jwt.sign({ userId: user.id }, JWT_SECRET);
    },
    joinEvent: async (_: any, { eventId }: any, { req, io }: any) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw new Error('Not authenticated');
      let userId: string;
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch {
        throw new Error('Invalid token');
      }
      // Check event and user exist
      const eventExists = await prisma.event.findUnique({ where: { id: eventId } });
      if (!eventExists) throw new Error('Event not found');
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) throw new Error('User not found');
      // Update event
      const event = await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: userId } } },
        include: { attendees: true },
      });
      // Broadcast via Socket.io
      io.to(eventId).emit('joinedUsers', event.attendees);
      return event;
    },
  },
  Event: {
    attendees: (parent: any) => parent.attendees,
  },
};