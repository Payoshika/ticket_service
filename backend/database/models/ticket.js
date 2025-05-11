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
  issuerName: {
    type: String,
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
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 1) Hook for CREATE or SAVE
ticketSchema.post("save", async function (doc) {
  try {
    // Use the _id as the document ID in Elasticsearch
    await esClient.index({
      index: "tickets",
      id: doc._id.toString(), // Pass _id as a parameter, not in the body
      body: {
        issuer: doc.issuer,
        issuerName: doc.issuerName,
        name: doc.name,
        description: doc.description,
        status: doc.status,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    console.error("Error indexing new ticket:", error);
  }
});

// 2) Hook for UPDATE
ticketSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  try {
    await esClient.update({
      index: "tickets",
      id: doc._id.toString(), // Use _id as the document ID
      body: {
        doc: {
          issuer: doc.issuer,
          issuerName: doc.issuerName,
          name: doc.name,
          description: doc.description,
          status: doc.status,
          createdAt: doc.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error updating ticket in Elasticsearch:", error);
  }
});

// 3) Hook for DELETE
ticketSchema.post("findOneAndDelete", async function (doc) {
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
