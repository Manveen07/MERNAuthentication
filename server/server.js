import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //

const port = 8080;

app.get("/", (req, res) => {
  res.status(201).json("Home GET requested");
});

app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(port, () =>
        console.log(`server listening on port http://localhost:${port}`)
      );
    } catch (e) {
      console.log("connection error");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection");
  });
