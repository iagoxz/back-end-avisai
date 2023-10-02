const express = require('express');
const authController = require("./controllers/authController")
const AdminController = require("./controllers/AdminController")

const authenticateMiddleware = require ("./middlewares/authenticate")
const app = express();

app.use(express.json());

app.use("/auth", authController)
app.use("/admin", authenticateMiddleware, AdminController)

app.listen(3000, () => {
    console.log('Server is running!');
});