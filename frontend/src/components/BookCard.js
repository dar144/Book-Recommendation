import React, { useState, useEffect } from "react";
import "../styles/Books.css";
import { addBook, removeBook, addToWishlist, removeFromWishlist } from "../services/api"; // Import your API functions

const BookCard = ({ username, book, booksRead, booksWishlist }) => {
  const [booksReadList, setBooksReadList] = useState(booksRead);
  const [isRead, setIsRead] = useState(booksRead.includes(book.title));
  const [isInWishlist, setIsInWishlist] = useState(booksWishlist.includes(book.title));
  const [wishlistDisabled, setWishlistDisabled] = useState(isRead);

  useEffect(() => {
    setWishlistDisabled(isRead); // Disable wishlist button if book is marked as read
    // setBooksReadList([...booksReadList, book.title])
  }, [isRead]);

  const updateState = (type, value) => {
    if (type === "read") {
      setIsRead(value);
      setWishlistDisabled(value); // Update wishlist state based on read status

    } else if (type === "wishlist") {
      setIsInWishlist(value);
    }
  };

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
      () => updateState("read", true),
      () => alert("Failed to mark book as read. Please try again.")
    );
  };

  const handleRemoveBook = () => {
    handleApiRequest(
      removeBook,
      () => updateState("read", false),
      () => alert("Failed to unmark book as read. Please try again.")
    );
  };

  const handleAddToWishlist = () => {
    handleApiRequest(
      addToWishlist,
      () => updateState("wishlist", true),
      () => alert("Failed to add book to wishlist. Please try again.")
    );
  };

  const handleRemoveFromWishlist = () => {
    handleApiRequest(
      removeFromWishlist,
      () => updateState("wishlist", false),
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
          onClick={() => {
            if (!isRead) handleAddBook();
            else handleRemoveBook();
            window.location.reload();
          }}
        >
          {isRead ? "Read" : "Mark as Read"}
        </button>
        <button
          className={isInWishlist ? "button-wishlist" : ""}
          onClick={() => {
            if (!isInWishlist) handleAddToWishlist();
            else handleRemoveFromWishlist();

            window.location.reload();
          }}
          disabled={wishlistDisabled}
        >
          {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
