import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "./config/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schemas/index.js";

async function startServer() {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.server.port as number },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
