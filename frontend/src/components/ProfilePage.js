import React from 'react';
import { fetchProfile, addLikedBook, removeLikedBook } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import '../styles/Profile.css';

const Profile = () => {
  const { data: profile, loading, error, setData: setProfile } = useFetch(fetchProfile);

  const handleBookAction = async (action, bookTitle) => {
    try {
      const apiCall = action === 'add' ? addLikedBook : removeLikedBook;
      await apiCall({ book: bookTitle });
      setProfile((prevProfile) => {
        const updatedBooksLiked = action === 'add'
          ? [...prevProfile.booksLiked, bookTitle]
          : prevProfile.booksLiked.filter((title) => title !== bookTitle);
        return { ...prevProfile, booksLiked: updatedBooksLiked };
      });
    } catch (err) {
      console.error(`Failed to ${action} book`, err);
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const { user, booksRead, booksLiked, booksWishlist, recommendedBook } = profile;

  const renderBookSection = (title, books, actionEnabled) => (
    <div className="left-container">
      <div className="profile-section">
        <h2>{title}</h2>
        <div className="card-grid">
          {books.length > 0 ? (
            books.map((book, index) => {
              const { properties: { imageUrl, title, year, language, genre } } = book.book;
              const { properties: { name: authorName } } = book.author;

              return (
                <div className="read-book-card" key={index}>
                  <img src={imageUrl} alt={title} className="book-image" />
                  <div className="read-book-details">
                    <p className="book-title">
                      {title}
                      {actionEnabled && (
                        <span
                          className={`star ${booksLiked.includes(title) ? 'star-gold' : ''}`}
                          onClick={() => handleBookAction(
                            booksLiked.includes(title) ? 'remove' : 'add',
                            title
                          )}
                        >
                          &#9733;
                        </span>
                      )}
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
            <p className="empty-message">No books in this section.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="profile-header">
        <h1>{profile.user}</h1>
      </div>
      <div className="profile-container">
        <div className="profile-left">
          {renderBookSection("Books Read", booksRead, true)}
          {renderBookSection("Wishlist", booksWishlist, false)}
          {renderBookSection("Recommendations", recommendedBook, false)}
        </div>
      </div>
    </>
  );
};

export default Profile;
