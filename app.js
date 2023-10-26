require("dotenv").config();
const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

app.use("/images", express.static("public/images"));

const mediaRouter = require("./routes/profile.routes");
app.use("/api/v1", mediaRouter);

const authRouter = require("./routes/auth.routes");
app.use("/api/v1/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: "Internal Server Error",
    data: err.message,
  });
});

app.listen(PORT, () => console.log("server hidup", PORT));
