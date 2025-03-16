// frontend/src/pages/AddBookPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBookPage.css';

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publicationYear: '',
    description: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic form validation
    if (!formData.title || !formData.author || !formData.genre || !formData.publicationYear) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': user.role  // simulate auth header; in production, use tokens
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Error adding book');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="addbook-container">
      <div className="addbook-card">
        <h2>Add New Book</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="addbook-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input 
              id="title"
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Enter book title" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input 
              id="author"
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              required 
              placeholder="Enter author name" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select 
              id="genre"
              name="genre" 
              value={formData.genre} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-fiction">Non-fiction</option>
              <option value="Science">Science</option>
              {/* Add more genres as needed */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="publicationYear">Publication Year:</label>
            <input 
              id="publicationYear"
              name="publicationYear" 
              type="number" 
              value={formData.publicationYear} 
              onChange={handleChange} 
              required 
              placeholder="Enter publication year" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Enter a brief description" 
            />
          </div>
          <button type="submit" className="submit-button">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
