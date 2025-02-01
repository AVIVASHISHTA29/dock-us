import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { config } from "./config/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schemas/index.js";

async function startServer() {
  const app = express();

  // Enable CORS
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server) as unknown as express.RequestHandler
  );

  app.listen(config.server.port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${config.server.port}/graphql`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
