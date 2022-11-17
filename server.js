const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running. Use our API on port: 4500");
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
