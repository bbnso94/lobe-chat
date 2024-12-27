const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Verify Webhook Signature (optional but recommended)
function verifySignature(req, res, next) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  const receivedSignature = req.headers["clerk-signature"];
  
  if (!receivedSignature || receivedSignature !== secret) {
    return res.status(401).send("Unauthorized");
  }
  
  next();
}

// Webhook endpoint
app.post("/webhook", verifySignature, (req, res) => {
  console.log("Received Webhook:", req.body);

  // Handle events
  const event = req.body.event;
  if (event === "user.created") {
    console.log("New user created:", req.body.data);
  } else if (event === "user.updated") {
    console.log("User updated:", req.body.data);
  }

  res.status(200).send("Webhook processed");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
