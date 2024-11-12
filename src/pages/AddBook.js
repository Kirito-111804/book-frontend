import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBook = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishedYear, setPublishedYear] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!title || !author || !publishedYear || !genre || !description) {
            setError('All fields are required.');
            return;
        }
    
        const newBook = { 
            title, 
            author, 
            published_year: parseInt(publishedYear, 10), 
            genre, 
            description, 
            id: Date.now() 
        };
    
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add book');
            }
    
            const data = await response.json();
            onAdd(data); // Update the parent component's state
    
            navigate('/'); // Redirect to home after adding the book
        } catch (error) {
            setError(error.message); // Show error message to the user
        } finally {
            setLoading(false);
        }
    };
    

    // Handle the back navigation
    const handleBack = () => {
        navigate('/'); // Navigate to home page
    };

    return (
        <div className="container my-5">
            <h2 className="text-center text-warning mb-4">Add New Book</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg">
                <div className="form-group">
                    <label htmlFor="title" className="text-light">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author" className="text-light">Author</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="publishedYear" className="text-light">Published Year</label>
                    <input
                        type="number"
                        id="publishedYear"
                        value={publishedYear}
                        onChange={(e) => setPublishedYear(e.target.value)}
                        required
                        className="form-control"
                        min="1500"
                        max={new Date().getFullYear()}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="genre" className="text-light">Genre</label>
                    <input
                        type="text"
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="text-light">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-control"
                        rows="5"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="btn btn-warning btn-block mt-3"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Book'}
                </button>
            </form>

            <button 
                onClick={handleBack} 
                className="btn btn-secondary mt-3"
            >
                Back to Home
            </button>
        </div>
    );
};

export default AddBook;
