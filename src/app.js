import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { swaggerSpec, swaggerUiMiddleware, swaggerDocsMiddleware } from "./swagger.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/docs", swaggerUiMiddleware,swaggerDocsMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ ok: true, service: "E-commerce API", version: "1.0.0" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
