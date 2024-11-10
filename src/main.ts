import express, { Request, Response } from "express";
import { createMetric } from "./routes/metrics/post";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

app.post("/metrics", createMetric);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
