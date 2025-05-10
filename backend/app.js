// Description: This is the main entry point for the backend application. It sets up the Express server, connects to the MongoDB database, and defines the API endpoints for user and ticket management.

// Importing required modules
const express = require("express");
const app = express();
const mongoose = require("./database/mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

// database connection
const PORT = 3000;

//user and ticket data models
const User = require("./database/models/user");
const Ticket = require("./database/models/ticket");
app.use(express.json());

//elasticsearch connection
const esClient = require("./elasticsearch");

// setting CORS : backend :3000 frontend: 4200
app.use(
  cors({
    origin: ["http://localhost:4200"], // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// create URL point for CRUD operations for user and ticket
// user registration
app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .send({ error: "Unable to register user. Please try again later." });
  }
});
// user login
app.post("/api/users/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(500)
      .send({ error: "Unable to login user. Please try again later." });
  }
});
// jwt token verification function
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

//authenticate user
app.get("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Unable to fetch user profile" });
  }
});

// user CRUD operations
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Unable to fetch users. Please try again later." });
  }
});
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
  å;
});

// ticket CRUD operations
app.post("/api/tickets", async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/api/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).send(tickets);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Unable to fetch tickets. Please try again later." });
  }
});
app.get("/api/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
});

// searching ticket using elasticsearch
app.get("/api/tickets/search", async (req, res) => {
  try {
    const { query } = req.query;

    const result = await esClient.search({
      index: "tickets",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["name", "issuer", "description", "status"],
          },
        },
      },
    });

    const tickets = result.hits.hits.map((hit) => hit._source);
    res.status(200).send(tickets);
  } catch (error) {
    console.error("Error searching tickets:", error);
    res.status(500).send({ error: "Unable to search tickets" });
  }
});

app.put("/api/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete("/api/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).send();
    }
    res.status(200).send(ticket);
  } catch (error) {
    res.status(500).send(error);
  }
});

// searching ticket by user
// search by name, issuer, description, and status and createdAt
app.get("/api/tickets/search", async (req, res) => {
  try {
    const { name, issuer, description, status, createdAt } = req.query;
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (issuer) {
      query.issuer = { $regex: issuer, $options: "i" };
    }
    if (description) {
      query.description = { $regex: description, $options: "i" };
    }
    if (status) {
      query.status = { $regex: status, $options: "i" };
    }
    if (createdAt) {
      query.createdAt = { $regex: createdAt, $options: "i" };
    }
    const tickets = await Ticket.find(query);
    res.status(200).send(tickets);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
