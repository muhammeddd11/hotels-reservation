const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const ApiError = require("./utils/apiError");
const globalErorr = require("./middlewares/erorrMiddleWare");
dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
// const userRoute = require('./routes/userRoute');
const authRoute = require("./routes/authRoute");
const session = require("express-session");
const store = new session.MemoryStore();

// Connect With DB
dbConnection();
// express app
const app = express();

app.use(
  session({
    secret: "network security",
    cookie: { maxAge: 30000 },
    saveUninitialized: true,
    resave: true,
    store
  })
);

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

console.log('Memory Store : ', store)

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//Mount Routes
// app.use('/api/v1/users', userRoute);
app.use("/api/v1/auth", authRoute);

// Route Not Handling
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't Find This Route ${req.originalUrl}`, 400));
});

// Global Error Handling Middle Ware
app.use(globalErorr);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log("App Run Successfully");
});

// handle Rejection Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection: ${err.name} | ${err.message}`);
  server.close((err) => {
    console.error(`Applecation Shut Down Now........`);
    process.exit(1);
  });
});
const registerRouter = require('./routes/register.js')
app.use('/api', registerRouter)

