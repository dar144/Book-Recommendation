const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { session } = require("../neo4j-driver");

const router = express.Router();
const SECRET_KEY = "secret_key"; // Replace with a secure key

// User Registration
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
//   console.log(email, username, password)

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Neo4j
    await session.run(
      `
      CREATE (u:User {name: $username, email: $email, password: $hashedPassword})
      RETURN u
      `,
      { username, email, hashedPassword }
    );

    const token = jwt.sign(user, SECRET_KEY);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration failed.");
  }
});



module.exports = router;
