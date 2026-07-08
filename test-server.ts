import express from "express";
import handler from "./api/index.ts";

const app = express();
app.use((req, res) => {
  handler(req, res);
});

app.listen(3000, () => {
  console.log("Listening on 3000");
});
