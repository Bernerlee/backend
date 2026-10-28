// Stage 0 - Start the Server
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Hello server, CRUD API listening on port ${port}`);
});
