const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const port = 3001;
var cors = require("cors");
// const generator = require("./generate-dao");

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/server/getForm", function (req, res) {
  console.log(req.body);
  res.send("Post success!");
  generator(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
