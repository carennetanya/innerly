import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import streakRoutes from "./routes/streak.js";
import reflectionRoutes from "./routes/reflection.js";
import commitmentRoutes from "./routes/commitment.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "https://innerly-psi.vercel.app",
    "https://innerly.my.id",
    "http://localhost:5173",
  ],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/reflections", reflectionRoutes);
app.use("/api/commitment", commitmentRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Innerly API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});