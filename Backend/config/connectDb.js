// Database ko connect karny kay liyay we use connectDb file
const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log(`MongoDb connected Succesfully`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { connectDb };
