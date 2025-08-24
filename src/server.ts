import mongoose from "mongoose";
import app from "./app";
import { PORT, MONGO_URI } from "./config";

function redact(u: string) {
  return u.replace(/:\/\/.*?:.*?@/, "://***:***@");
}

async function start() {
  try {
    console.log("Connecting to MongoDB:", redact(MONGO_URI));
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    mongoose.connection.on("error", (e) => {
      console.error("MongoDB runtime error:", e?.message || e);
    });

    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: unknown) {
    const e = err as { message?: string; codeName?: string; reason?: { codeName?: string } };
    const msg = e?.message || e?.reason?.codeName || e?.codeName || "DB connection failed";
    console.error("DB connection failed:", msg);
    process.exit(1);
  }
}

start();

export default app;
