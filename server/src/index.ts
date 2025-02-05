import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schemas/index.js";

import { createClient } from "redis";
import { config } from "./config/index.js";

export const client = createClient({
  url: config.redis,
});

client.on("error", function (err) {
  throw err;
});

async function startServer() {
  await client.connect();
  const app = express();

  // Configure CORS with all origins allowed
  const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply CORS middleware first
  app.use(cors(corsOptions));
  app.use(express.json());

  // Handle preflight requests
  app.options("/graphql", cors(corsOptions));

  // Apply Apollo middleware with CORS options
  app.use(
    "/graphql",
    cors(corsOptions),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    }) as unknown as express.RequestHandler
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
  client.set("hi", "bye");
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
