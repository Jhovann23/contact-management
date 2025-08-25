const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')

const PORT = 3000;

dotenv.config()
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use(routes);

app.listen(PORT, () => {
  console.log("Server running at port " + PORT);
});
