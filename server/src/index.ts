import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { createClient } from "redis";
import { config } from "./config/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/schemas/index.js";

const corsOptions = {
  origin: ["https://dock-us-client.vercel.app", "http://localhost:3000"],
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

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

let isServerStarted = false;

async function initServer() {
  if (!isServerStarted) {
    try {
      await client.connect();
      await server.start();
      isServerStarted = true;
    } catch (error) {
      console.error("Failed to initialize server:", error);
      throw error;
    }
  }
}

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(express.json());

// Add OPTIONS handler for preflight requests
app.options("*", cors(corsOptions));

app.use("/graphql", async (req, res, next) => {
  try {
    await initServer();
    return expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })(req, res, next);
  } catch (error) {
    console.error("Error in GraphQL middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing Redis connection...");
  client.quit().finally(() => {
    process.exit(0);
  });
});

// Export the Express app as the default export for Vercel
export default app;
