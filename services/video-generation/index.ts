import express, { Request, Response } from "express";
import { createVideo } from "./CreateVideo";
import { getVideoList } from "./VideoManager";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

app.post("/test-generation", async (_, res: Response) => {
  createVideo();

  res.status(200).json({ message: "Endpoint executed"})
});

app.listen(PORT, () => {
  console.log(`Video generation service is running on http://localhost:${PORT}`);
});
