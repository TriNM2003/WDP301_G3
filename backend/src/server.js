const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const httpsErrors = require("http-errors");
const cors = require("cors"); 
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");

const app = express();
const db = require("./models/index");
const { systemRoleRouter, authRouter } = require("./routes");

// Sử dụng cors middleware để cho phép request từ localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(morgan("dev"));
app.use(bodyParser.json());

// khoi tao express session va passport (cho google login register)
app.use(
  session({
    secret: "CatandDogWTH",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});

// Định tuyến theo các chức năng thực tế
app.use("/systemRoles", systemRoleRouter);
app.use("/auth",authRouter);

app.use(async (req, res, next) => {
  next(httpsErrors(404, "Bad Request"));
});
app.use(async (err, req, res, next) => {
  res.status = err.status || 500;
  res.send({ error: { status: err.status, message: err.message } });
});

const host = process.env.HOSTNAME;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
  db.connectDB();
});
