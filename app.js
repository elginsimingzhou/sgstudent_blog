require('dotenv').config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));
app.use(expressLayout);
app.set("layout", "./layouts/main"); // app.set(name, value) => set setting "name" as value
app.set("view engine", "ejs");

connectDB();

app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
