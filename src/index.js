import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDB();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost: ${PORT}`);
  });

  //graceful shutdown
  const signals = ["SIGINT", "SIGTERM"];
  for (const sig of signals) {
    process.on(sig, async () => {
      console.log(`\nReceived ${sig}. Shutting down gracefully...`);
      server.close(() => process.exit(0));
    });
  }
}

bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
});
