const express = require("express");
const router = express.Router();
const { session } = require("../neo4j-driver");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret_key"; 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
    try {
        const user = jwt.verify(token, SECRET_KEY); 
        req.user = user; 
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
  };

router.get('/', authenticateToken, async (req, res) => {
    // const username = "Diana"; 
    const username = req.user.name; 

    try {
      // Fetch user profile, books read, wishlist, liked books, and follows
      const result = await session.run(
        `
        MATCH (b:Book)
        OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
        OPTIONAL MATCH (booksRead:Book)-[:READ_BY]->(u:User {name: $username})
        OPTIONAL MATCH (booksWishlist:Book)<-[:WISHLIST]-(u:User {name: $username})
        RETURN  collect(DISTINCT {
                    title: b.title,
                    year: b.year,
                    language: b.language,
                    imageUrl: b.imageUrl,
                    author: a.name,
                    genre: b.genre
                    }) as books, 
               collect(DISTINCT booksRead.title) as booksRead,
               collect(DISTINCT booksWishlist.title) as booksWishlist 
        `,
        { username }
      );

    const record = result.records[0];
    // const username = record.get('username');
    const books = record.get('books');
    const booksRead = record.get('booksRead');
    const booksWishlist = record.get('booksWishlist');
  
      res.json({
        username,
        books,
        booksRead,
        booksWishlist
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/add-book', authenticateToken, async (req, res) => {
    const { book, user } = req.body;
    console.log(book, user);

    if (!book || !user) {
        return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }
  
    try {
        const query = `
              MATCH (u:User {name: $user}), (b:Book {title: $book})
              OPTIONAL MATCH (u)-[w:WISHLIST]->(b)
              DELETE w
              MERGE (u)<-[r:READ_BY]-(b)
              RETURN r`
        ;
        const result = await session.run(query, { book, user });

        if (result.records.length = 0) {
            res.status(500).json({ message: 'Failed to add book.' });
        }
    } catch (error) {
        console.error('Error adding book to database:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

router.post('/remove-book', authenticateToken, async (req, res) => {
  const { book, user } = req.body;

  if (!book || !user) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
  }

  try {
      const query = `
          MATCH (b:Book {title: $book}) -[r:READ_BY]-> (u:User {name: $user})
          DETACH DELETE r
          `
      ;
      const result = await session.run(query, { book, user });

      if (result.records.length = 0) {
          res.status(500).json({ message: 'Failed to add book.' });
      }
  } catch (error) {
      console.error('Error adding book to database:', error);
      res.status(500).json({ message: 'An error occurred.' });
  }
});

router.post('/add-wishlist', authenticateToken, async (req, res) => {
  const { book, user } = req.body;

  if (!book || !user) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
  }

  try {
      const query = `
          MATCH (u:User {name: $user}), (b:Book {title: $book})
          MERGE (u)-[r:WISHLIST]->(b)
          RETURN r`
      ;
      const result = await session.run(query, { book, user });

      if (result.records.length = 0) {
          res.status(500).json({ message: 'Failed to add book.' });
      }
  } catch (error) {
      console.error('Error adding book to database:', error);
      res.status(500).json({ message: 'An error occurred.' });
  }
});


router.post('/remove-wishlist', authenticateToken, async (req, res) => {
  const { book, user } = req.body;

  if (!book || !user) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
  }

  try {
      const query = `
          MATCH (b:Book {title: $book}) <-[r:WISHLIST]- (u:User {name: $user})
          DETACH DELETE r`
      ;
      const result = await session.run(query, { book, user });

      if (result.records.length = 0) {
          res.status(500).json({ message: 'Failed to add book.' });
      }
  } catch (error) {
      console.error('Error adding book to database:', error);
      res.status(500).json({ message: 'An error occurred.' });
  }
});

  
  module.exports = router;