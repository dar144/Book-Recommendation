import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { fetchProfile, addLikedBook, removeLikedBook } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // For managing button state during request

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await fetchProfile(); // Token is handled by the interceptor
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      }
    };

    getProfile();
  }, []);

  const handleAddLiked = async (book) => {
    // Only proceed if the book isn't already liked
    if (!booksLiked.includes(book.book.properties.title)) {
      try {
        await addLikedBook({
          book: book.book.properties.title,
          user: profile.user,
        });
        // Update the local state to reflect the change immediately
        setProfile(prevProfile => ({
          ...prevProfile,
          booksLiked: [...prevProfile.booksLiked, book.book.properties.title]
                }));
      } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book. Please try again.');
      }
    }
  };
  
  const handleRemoveLiked = async (book) => {
    // Check if the book is in the liked books before attempting to remove it
    if (booksLiked.includes(book.book.properties.title)) {
      try {
        await removeLikedBook({
          book: book.book.properties.title,
          user: profile.user,
        });
        // Update the local state to reflect the change immediately
        setProfile(prevProfile => ({
          ...prevProfile,
          booksLiked: prevProfile.booksLiked.filter(b => b !== book.book.properties.title),
        }));
      } catch (error) {
        console.error('Error removing book:', error);
        alert('Failed to remove book. Please try again.');
      }
    }
  };
  

  if (error) return <p className="error-message">Error: {error}</p>;
  if (!profile) return <p className="loading-message">Loading...</p>;

  const { user, booksRead, booksLiked, booksWishlist, recommendedBook } = profile;
  // console.log(recommendedBook);

  return (
    <>
      <div className="profile-header">
        <h1>{user}</h1>
      </div>
      <div className="profile-container">
        <div className="left-container">
          {/* Books Read Section */}
          <div className="profile-section">
            <h2>Books Read</h2>
            <div className="card-grid">
              {booksRead.length > 0 ? (
                booksRead.map((book, index) => {
                  const { properties: { imageUrl, title, year, language, genre } } = book.book;
                  const { properties: { name: authorName } } = book.author;

                  return (
                    <div className="read-book-card" key={index}>
                      <img src={imageUrl} alt={title} className="book-image" />
                      <div className="read-book-details">
                        <p className="book-title">
                          {title}
                          <span
                            className={`star ${booksLiked.includes(title) ? "star-gold" : ""}`}
                            onClick={() => {
                              if (!booksLiked.includes(title)) {
                                handleAddLiked(book);
                              } else {
                                handleRemoveLiked(book);
                              }
                              // window.location.reload();
                            }}
                            disabled={loading}  // Disable the star while loading
                          >
                            &#9733;
                          </span>
                        </p>
                        <p className="book-info">By {authorName}</p>
                        <p className="book-meta">
                          Year: {year} | Language: {language}
                        </p>
                        <p className="book-meta">{genre}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-message">No books read yet.</p>
              )}
            </div>
          </div>

          {/* Wishlist Section */}
          <div className="profile-section">
            <h2>Wishlist</h2>
            <div className="card-grid">
              {booksWishlist.length > 0 ? (
                booksWishlist.map((book, index) => {
                  const { properties: { imageUrl, title, year, language, genre } } = book.book;
                  const { properties: { name: authorName } } = book.author;

                  return (
                    <div className="read-book-card" key={index}>
                      <img src={imageUrl} alt={title} className="book-image" />
                      <div className="read-book-details">
                        <p className="book-title">{title}</p>
                        <p className="book-info">By {authorName}</p>
                        <p className="book-meta">
                          Year: {year} | Language: {language}
                        </p>
                        <p className="book-meta">{genre}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-message">No books in wishlist.</p>
              )}
            </div>
          </div>

          {/* Recommendation Section */}
          <div className="profile-section">
            <h2>Recommendations</h2>
            <div className="card-grid">
              {recommendedBook.length > 0 ? (
                recommendedBook.map((book, index) => {
                  const { properties: { imageUrl, title, year, language, genre } } = book.book;
                  const { properties: { name: authorName } } = book.author;

                  return (
                    <div className="read-book-card" key={index}>
                      <img src={imageUrl} alt={title} className="book-image" />
                      <div className="read-book-details">
                        <p className="book-title">{title}</p>
                        <p className="book-info">By {authorName}</p>
                        <p className="book-meta">
                          Year: {year} | Language: {language}
                        </p>
                        <p className="book-meta">{genre}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-message">No books in the recommendation section.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
