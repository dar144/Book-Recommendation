import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


import profileRoutes from "./routes/profile.js";
import booksRoutes from "./routes/books.js";
import registerRoutes from "./routes/register.js";
import loginRoutes from "./routes/login.js";

import serverless from "serverless-http"

const app = express();
// const PORT = 4000;

// Enable CORS for your frontend (update the URL to match your frontend's origin)
app.use(cors({
  origin: 'http://localhost:3000',  // Or your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());


app.use("/profile", profileRoutes);
app.use("/books", booksRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);



// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports.handler = serverless(app);
