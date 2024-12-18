import React from 'react';
import BookCard from "./BookCard";
import { fetchBooks } from '../services/api';
import { useFetch } from '../hooks/useFetch';

const BookList = () => {
  const { data: booksList, loading, error, setData: setBooksList } = useFetch(fetchBooks);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const { username, books, booksRead, booksWishlist } = booksList;

  const updateBookState = (bookTitle, type, value) => {
    setBooksList((prev) => {
      const updatedBooksRead = type === "read"
        ? value ? [...prev.booksRead, bookTitle] : prev.booksRead.filter((b) => b !== bookTitle)
        : prev.booksRead;

      const updatedBooksWishlist = type === "wishlist"
        ? value ? [...prev.booksWishlist, bookTitle] : prev.booksWishlist.filter((b) => b !== bookTitle)
        : prev.booksWishlist;

      return { ...prev, booksRead: updatedBooksRead, booksWishlist: updatedBooksWishlist };
    });
  };

  return (
    <div className="book-list">
      {books.map((book, index) => (
        <BookCard
          key={index}
          username={username}
          book={book}
          booksRead={booksRead}
          booksWishlist={booksWishlist}
          updateBookState={updateBookState}
        />
      ))}
    </div>
  );
};

export default BookList;
