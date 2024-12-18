import React, { useEffect, useState } from "react";
import "../styles/Books.css";
import { addBook, removeBook, addToWishlist, removeFromWishlist } from "../services/api";

const BookCard = ({ username, book, booksRead, booksWishlist, updateBookState }) => {
  const [isRead, setIsRead] = useState(booksRead.includes(book.title));
  const [isInWishlist, setIsInWishlist] = useState(booksWishlist.includes(book.title));
  const [wishlistDisabled, setWishlistDisabled] = useState(isRead);

  useEffect(() => {
    setWishlistDisabled(isRead);
  }, [isRead]);

  const handleApiRequest = async (apiFunction, successCallback, errorCallback) => {
    try {
      await apiFunction({ book: book.title, user: username });
      successCallback();
    } catch (error) {
      console.error(`Error processing request:`, error);
      errorCallback();
    }
  };

  const handleAddBook = () => {
    handleApiRequest(
      addBook,
      () => {
        setIsRead(true);
        updateBookState(book.title, "read", true);
      },
      () => alert("Failed to mark book as read. Please try again.")
    );
  };

  const handleRemoveBook = () => {
    handleApiRequest(
      removeBook,
      () => {
        setIsRead(false);
        updateBookState(book.title, "read", false);
      },
      () => alert("Failed to unmark book as read. Please try again.")
    );
  };

  const handleAddToWishlist = () => {
    handleApiRequest(
      addToWishlist,
      () => {
        setIsInWishlist(true);
        updateBookState(book.title, "wishlist", true);
      },
      () => alert("Failed to add book to wishlist. Please try again.")
    );
  };

  const handleRemoveFromWishlist = () => {
    handleApiRequest(
      removeFromWishlist,
      () => {
        setIsInWishlist(false);
        updateBookState(book.title, "wishlist", false);
      },
      () => alert("Failed to remove book from wishlist. Please try again.")
    );
  };

  return (
    <div className="book-card">
      <div className="book-card-text">
        <img src={book.imageUrl} alt={book.title} className="book-image" />
        <div className="book-card-info">
          <p style={{ fontSize: "large" }}>
            <b>{book.title}</b>
          </p>
          <p>By {book.author}</p>
          <p>
            Year: {book.year} | Language: {book.language}
          </p>
          <p>{book.genre}</p>
        </div>
      </div>
      <div className="book-card-button">
        <button
          className={isRead ? "button-read" : ""}
          onClick={isRead ? handleRemoveBook : handleAddBook}
        >
          {isRead ? "Read" : "Mark as Read"}
        </button>
        <button
          className={isInWishlist ? "button-wishlist" : ""}
          onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
          disabled={wishlistDisabled}
        >
          {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
