import React from 'react';
import BookList from "../components/BookList";

const BooksPage = () => {
  return (
    <div className="books-page">
      <h1>Books</h1>
      <BookList />
    </div>
  );
};

export default BooksPage;
