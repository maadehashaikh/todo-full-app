const express = require("express");
const app = express();
const port = 8082;
const { connectDb } = require("./config/connectDb");
const todoRoute = require("./routes/todo.route");
const userRoutes = require("./routes/user.route");
const cors = require("cors");

connectDb();
app.use(cors());
app.use(express.json());
app.use("/api", todoRoute);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
