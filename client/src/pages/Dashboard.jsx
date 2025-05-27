import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Ensure your styles are correct

export default function Dashboard() {
    const { user, logout } = useContext(UserContext);
    const [url, setUrl] = useState('');           // To store the entered URL
    const [isLoading, setIsLoading] = useState(false);  // To handle loading state
    const [error, setError] = useState('');       // To handle any error messages
    const navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();

        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            if (typeof logout === 'function') {
                try {
                    await logout(); // Call the logout function to clear user session
                    navigate('/');  // Redirect to home page after logout
                } catch (error) {
                    console.error('Logout failed:', error.response?.data || error.message);
                }
            } else {
                console.error('Logout function is not available');
            }
        }
    };

    const handleclassifyClick = () => {
        navigate('/classification');  // Navigate to the scraping page
    };

    // Navigate to the DistilBERT QA model page
    const handleDistilBertClick = () => {
        navigate('/distilbert-qa'); // Navigate to the DistilBertQA page
    };

    // Navigate to the "View Dataset" page
    const handleViewDatasetClick = () => {
        navigate('/view-dataset');  // Navigate to the view dataset page
    };


    // Navigate to the Extract Data page
    const handleExtractDataClick = () => {
        navigate('/extract-data');  // Navigate to the new extract data page
    };

    return (
        <div className="dashboard">
            <nav className="navbar">
                <button className="nav-button" onClick={handleLogout}>Logout</button>
            </nav>
            <h1>Dashboard</h1>
            <div className="details">
                <h1>RAG Cyber Detection - K.Rakshitha, 22BD1A660R</h1>
            </div>
            <form className='alloptions'>
                <div className="options">
                    <button className="option-button" onClick={handleViewDatasetClick}>View Dataset</button>
                </div>
                <div className="options">
                    <button className="option-button" onClick={handleExtractDataClick}>Extract Data</button>
                </div>
                <div className="options">
                    <button className="option-button" onClick={handleclassifyClick}>Attribution Annotation/Classification</button>
                </div>
                <div className="options">
                    <button className="option-button" onClick={handleDistilBertClick}>DistilBERT QA Model</button>
                </div>
            </form>
        </div>
    );
}
