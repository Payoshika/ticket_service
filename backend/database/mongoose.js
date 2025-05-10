const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://127.0.0.1:27017/ticketDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = mongoose;
// This code connects to a MongoDB database using Mongoose. It sets up a connection to a local MongoDB instance running on port 27071 and uses the database named "myDatabase". If the connection is successful, it logs a message to the console. If there is an error, it logs the error message. The Mongoose instance is then exported for use in other parts of the application.
