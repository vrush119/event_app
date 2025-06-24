import { gql } from 'apollo-server-express';

export const typeDefs = gql`
type User {
    id: ID!
    name: String!
    email: String!
}
  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
  }

  type Query {
    events: [Event!]!
    me: User
  }

  type Mutation {
    joinEvent(eventId: ID!): Event!
    login(username: String!, password: String!): String! # returns JWT
  }
`;