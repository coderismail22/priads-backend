/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://fab-ads-demo.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);

// application routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to lms server " });
});

app.use("/api/v1", router);

//Middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
