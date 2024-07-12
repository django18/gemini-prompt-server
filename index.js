const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

const port = process.env.PORT || 3150;
app.listen(port, () => console.log(`Server listening on port ${port}`));
