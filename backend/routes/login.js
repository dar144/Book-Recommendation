const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { session } = require("../neo4j-driver");

const router = express.Router();
const SECRET_KEY = "secret_key"; // Replace with a secure key

// User Login
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, username, password);
  
  try {
    const result = await session.run(
      `
        MATCH (u:User {email: $email})
        RETURN u
      `,
      { email }
    );


    if (result.records.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = result.records[0].get("u").properties;
    // console.log(user.name);
    // console.log(user, password);

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(401).send("Invalid credentials.");
    }

    // Generate JWT
    const token = jwt.sign(user, SECRET_KEY);
    res.status(200).json({ token: token, username: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed.");
  }
});
  

module.exports = router;
