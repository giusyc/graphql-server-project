// src/builder.ts

import SchemaBuilder from "@pothos/core";
import { prisma } from "./db.js";
// 1
import { DateResolver } from "graphql-scalars";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Prisma } from "./generated/prisma/client.js";
import * as runtime from "@prisma/client/runtime/client";
// 2
export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: (prisma as any)._dmmf,
    datamodelPath: "./prisma/schema.prisma",
  },
});

// 3
builder.addScalarType("Date", DateResolver, {});

builder.queryType({});
