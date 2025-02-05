import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { createClient } from "redis";
import { config } from "./config/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schemas/index.js";

export const client = createClient({
  url: config.redis,
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 50, 3000);
      return delay;
    },
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function startServer() {
  const app = express();

  // More specific CORS configuration
  const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
      "Authorization",
    ],
  };

  try {
    await client.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Remove the global CORS middleware
  app.use(express.json());

  // Single CORS configuration for GraphQL endpoint
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
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  client.quit().finally(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing Redis connection...");
  client.quit().finally(() => {
    process.exit(0);
  });
});
