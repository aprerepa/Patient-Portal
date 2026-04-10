import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { patientRouter } from "./routes/patient.routes";
import { physicianRouter } from "./routes/physician.routes";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    })
  );

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/patient", patientRouter);
  app.use("/physician", physicianRouter);

  return app;
}
