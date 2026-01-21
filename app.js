const express = require("express");
const { connectToDB } = require("./connection");
const cookieParser = require('cookie-parser');
const cors = require("cors");
// setting up dotenv package
require("dotenv").config({
  quiet: true,
});
const homeRouter = require("./routes/index.js");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const taskRouter = require("./routes/task.js");

const port = process.env.PORT || 3000;
const app = express();

// parser
app.use(express.json())
app.use(cors(["*"]))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// handle routes
app.use("/",homeRouter)
app.use("/user",userRouter)
app.use("/task",taskRouter)
app.use("/auth",authRouter)

app.listen(port, () => {
  // DB Connection
  connectToDB();
  console.log(`app running on port ${port}`);
});
