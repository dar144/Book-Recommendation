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
    const username = req.user.name; 
    
    try {
      const result = await session.run(
        `
          MATCH (u:User {name: $username})
                  MATCH (u)<-[:READ_BY]-(b:Book)
                  OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
                  OPTIONAL MATCH (u)-[:LIKES]->(bl:Book)
                  OPTIONAL MATCH (u)-[:WISHLIST]->(w:Book)
                  OPTIONAL MATCH (w)-[:WRITTEN_BY]->(wa:Author)
          RETURN u AS user, 
                COLLECT(DISTINCT {book: b, author: a}) AS booksRead, 
                COLLECT(DISTINCT bl.title) AS booksLiked,  
                COLLECT(DISTINCT CASE WHEN w IS NULL THEN NULL ELSE {book: w, author: wa} END) AS booksWishlist
        `,
        { username }
      );

      const result_recommendation = await session.run(
        `
          MATCH (u:User {name: $username})
          OPTIONAL MATCH (u)-[:LIKES]->(likedBook:Book)
          OPTIONAL MATCH (likedBook)-[:WRITTEN_BY]->(authorLiked:Author)
          OPTIONAL MATCH (u)-[:READ_BY]->(:Book)<-[:READ_BY]-(similarUser:User)
          OPTIONAL MATCH (similarUser)-[:LIKES]->(similarBook:Book)
          OPTIONAL MATCH (authorLiked)<-[:WRITTEN_BY]-(authorBook:Book)
          OPTIONAL MATCH (u)-[:LIKES]->(likedBookWithGenre:Book)
          WITH u, likedBook, similarBook, authorBook, likedBookWithGenre.genre AS likedGenre
          MATCH (recommendation:Book)-[:WRITTEN_BY]->(authorRecommendation:Author)

          // Filter out books already read, liked, or wishlisted
          WHERE NOT (u)-[:LIKES|:WISHLIST]->(recommendation) AND NOT (u)<-[:READ_BY]-(recommendation)
          // Scoring
          WITH DISTINCT recommendation, authorRecommendation,
              count(similarBook) * 2 AS similarUserScore,
              count(authorBook) * 1.5 AS authorScore,
              CASE 
                  WHEN recommendation.genre IN collect(likedGenre) THEN 3
                  ELSE 0
              END AS genreScore
          ORDER BY (similarUserScore + authorScore + genreScore) DESC
          LIMIT 4
          RETURN COLLECT({book:recommendation, author:authorRecommendation}) AS recommendedBook
        `,
        { username }
      );

  
    const record = result.records[0];
    const record_recommendation = result_recommendation.records[0];
  
    const recommendedBook = record_recommendation.get('recommendedBook');;
    // console.log(recommendedBook);

    const user = username;
    let booksRead = [];
    let booksLiked = [];
    let booksWishlist = [];

    if (record) {
      booksRead = record.get('booksRead');
      booksLiked = record.get('booksLiked');
      booksWishlist = record.get('booksWishlist');
  } else {
      res.status(500).json({ message: 'No records found for the user.' });
      return; // Prevent further execution
  }

      res.status(200).json({
      user,
      booksRead,
      booksLiked,
      booksWishlist,
      recommendedBook
      // recommendedBook
    });
    // res.status(200).json({ message: 'Good.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/add-liked', authenticateToken, async (req, res) => {
    const user = req.user.name; 
    const { book } = req.body;
  
    if (!book || !user) {
        return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }
  
    try {
        const query = `
              MATCH (u:User {name: $user}), (b:Book {title: $book})
              MERGE (u)-[r:LIKES]->(b)
              RETURN r
            `
        ;
        const result = await session.run(query, { book, user });
  
        if (result.records.length == 0) {
            res.status(500).json({ message: 'Failed to add book.' });
        }
        res.status(200).json({ message: 'Good.' });
    } catch (error) {
        console.error('Error adding book to database:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
  });

  router.post('/remove-liked', authenticateToken, async (req, res) => {
    const user = req.user.name; 
    const { book } = req.body;
    
    if (!book || !user) {
      return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }
    
    try {
      const query = `
        MATCH (b:Book {title: $book}) <-[r:LIKES]- (u:User {name: $user})
        DELETE r
        RETURN COUNT(r) AS relationshipsRemoved
      `;
      const result = await session.run(query, { book, user });
  
      const relationshipsRemoved = result.records[0].get('relationshipsRemoved');
  
      // If no relationships were removed, it means the book wasn't liked by the user
      if (relationshipsRemoved === 0) {
        return res.status(404).json({ message: 'Book not liked by user.' });
      }
  
      res.status(200).json({ message: 'Book removed from liked.' });
    } catch (error) {
      console.error('Error removing book from database:', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  });
  
  
  module.exports = router;