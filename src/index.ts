// src/index.ts

// 1
import "dotenv/config";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { schema } from "./schema.js";
// 2
const port = Number(process.env.API_PORT) || 4000;
// 3
const yoga = createYoga({ schema });
const server = createServer(async (req, res) => {
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", () => resolve(Buffer.concat(chunks)));
          req.on("error", reject);
        })
      : undefined;

  const response = await yoga.fetch(req.url || "/", {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: body,
  });

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.statusCode = response.status;
  const responseBody = await response.text();
  res.end(responseBody);
});
// 4
server.listen(port, () => {
  console.log(`🚀 GraphQL Server ready at http://localhost:${port}/graphql`);
});
