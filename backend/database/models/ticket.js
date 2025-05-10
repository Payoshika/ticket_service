// create ticket model
const mongoose = require("mongoose");
const esClient = require("../../elasticsearch");

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

// 1) Hook for CREATE or SAVE
TicketSchema.post("save", async function (doc) {
  try {
    await esClient.index({
      index: "tickets",
      id: doc._id.toString(),
      body: doc.toObject(),
    });
  } catch (error) {
    console.error("Error indexing new ticket:", error);
  }
});

// 2) Hook for UPDATE
TicketSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  try {
    await esClient.update({
      index: "tickets",
      id: doc._id.toString(),
      body: { doc: doc.toObject() },
    });
  } catch (error) {
    console.error("Error updating ticket in Elasticsearch:", error);
  }
});

// 3) Hook for DELETE
TicketSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    await esClient.delete({
      index: "tickets",
      id: doc._id.toString(),
    });
  } catch (error) {
    console.error("Error deleting ticket from Elasticsearch:", error);
  }
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
// This code defines a Mongoose schema and model for a ticketing system. The ticket has fields for ID, issuer (a reference to id of user), name, description, status (with possible values of "open", "in progress", or "closed"), and a timestamp for when it was created. The model is then exported for use in other parts of the application.
