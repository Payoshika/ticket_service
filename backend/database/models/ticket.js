// create ticket model
const mongoose = require("mongoose");
// ID, Name, and Issuer are required
const ticketSchema = new mongoose.Schema({
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in progress", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
// This code defines a Mongoose schema and model for a ticketing system. The ticket has fields for ID, issuer (a reference to id of user), name, description, status (with possible values of "open", "in progress", or "closed"), and a timestamp for when it was created. The model is then exported for use in other parts of the application.
