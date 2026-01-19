// src/schema.ts

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
import { DateTimeResolver } from "graphql-scalars";
import { prisma } from "./db.js";

// Forward declarations
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(DateTimeResolver) },
    messages: {
      type: new GraphQLList(MessageType),
      resolve: async (user) => {
        return await prisma.message.findMany({
          where: { userId: user.id },
        });
      },
    },
  }),
});

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(DateTimeResolver) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: UserType,
      resolve: async (message) => {
        return await prisma.user.findUnique({
          where: { id: message.userId },
        });
      },
    },
  }),
});

// Define Query type
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return await prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { id }) => {
        return await prisma.user.findUnique({
          where: { id },
        });
      },
    },
    messages: {
      type: new GraphQLList(MessageType),
      resolve: async () => {
        return await prisma.message.findMany();
      },
    },
  },
});

// Define Mutation type
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { name }) => {
        return await prisma.user.create({
          data: { name },
        });
      },
    },
    createMessage: {
      type: MessageType,
      args: {
        body: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { body, userId }) => {
        return await prisma.message.create({
          data: { body, userId },
        });
      },
    },
  },
});

// Create schema
export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
