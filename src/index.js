let express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
let app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// DB Config
const MongoURI = require("./config/config").MongoURI;

// Connect to MongoDB Client
mongoose
  .connect(MongoURI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected successfully ..."))
  .catch(err => console.log(err));

let url = require("./routes/url");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

app.use(url);

//400
app.use((req, res, next) => {
  res.status(400).send("400 : Page not found !");
});

// 500
app.use((err, req, res, next) => {
  res.status(500).send("500 : Interval server error !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Listening at port ${PORT}...`));