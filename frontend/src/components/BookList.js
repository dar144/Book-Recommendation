import React, { useState, useEffect } from 'react';
import BookCard from "./BookCard";
import { fetchBooks } from '../services/api';

const BookList = () => {
  const [booksList, setBooksList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const { data } = await fetchBooks(); // Token is automatically added
        setBooksList(data);
      } catch (err) {
        setError('Failed to load books. Please log in again.');
      }
    };

    getBooks();
  }, []);

  if (error) return <p className="error-message">Error: {error}</p>;
  if (!booksList) return <p className="loading-message">Loading...</p>;

  const { username, books, booksRead, booksWishlist } = booksList;

  return (
    <div className="book-list">
      {books.map((book, index) => (
        <BookCard 
          key={index} 
          username={username} 
          book={book} 
          booksRead={booksRead} 
          booksWishlist={booksWishlist} 
        />
      ))}
    </div>
  );
};

export default BookList;
