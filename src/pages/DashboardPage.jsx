import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    genre: '',
    author: '',
    publicationYear: '',
  });
  const [isRealtime, setIsRealtime] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      ).toString();
      
      const response = await fetch(`http://localhost:5000/api/books?${query}`);
      const data = await response.json();
      setBooks(data);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    let interval;
    if (isRealtime) {
      interval = setInterval(() => {
        fetchBooks();
      }, 30000); // Check for updates every 30 seconds
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRealtime]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const toggleRealtime = () => {
    setIsRealtime(!isRealtime);
  };

  const formatLastUpdate = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const resetFilters = () => {
    setFilters({
      title: '',
      genre: '',
      author: '',
      publicationYear: '',
    });
    setTimeout(() => {
      fetchBooks();
    }, 0);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Book Collection</h2>
        <p className="dashboard-subtitle">Discover your next great read</p>
      </div>
      
      <div className="filter-section">
        <div className="realtime-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isRealtime}
              onChange={toggleRealtime}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">Real-time updates</span>
          </label>
          {isRealtime && (
            <div className="update-info">
              <span className="update-indicator"></span>
              <span className="update-text">Live • Last updated: {formatLastUpdate(lastUpdateTime)}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleFilter} className="filter-form">
          <div className="filter-inputs">
            <div className="input-group">
              <input
                name="title"
                placeholder="Search by title"
                value={filters.title}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="input-group">
              <input
                name="genre"
                placeholder="Genre"
                value={filters.genre}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="input-group">
              <input
                name="author"
                placeholder="Author"
                value={filters.author}
                onChange={handleChange}
                className="filter-input"
              />
            </div>
            <div className="input-group">
              <input
                name="publicationYear"
                placeholder="Publication Year"
                value={filters.publicationYear}
                onChange={handleChange}
                className="filter-input"
                type="number"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button type="button" onClick={resetFilters} className="reset-all-button">
              Reset All
            </button>
            <button type="submit" className="filter-button">
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your book collection...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="books-container">
          <p className="results-count">{books.length} books found</p>
          <ul className="book-list">
            {books.map((book) => (
              <li key={book._id} className="book-item">
                <Link to={`/book/${book._id}`} className="book-link">
                  <div className="book-card">
                    <div className="book-cover">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={`${book.title} cover`} />
                      ) : (
                        <div className="placeholder-cover">
                          <span>{book.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <span className="book-genre">{book.genre}</span>
                      {book.publicationYear && (
                        <span className="book-year">{book.publicationYear}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-results">
          <p>No books found matching your criteria.</p>
          <button onClick={resetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;