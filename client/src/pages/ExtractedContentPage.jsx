import React from 'react';
import { useLocation } from 'react-router-dom';
import './ExtractedContentPage.css';

const ExtractedContentPage = () => {
    const location = useLocation();
    const { content, filename } = location.state;

    return (
        <div className="extracted-content-page">
            <h1>Extracted Content</h1>
            <p><strong>File:</strong> {filename}</p> {/* Display the filename here */}
            <div className="content-box">
                <pre>{content}</pre> {/* Display the extracted content here */}
            </div>
        </div>
    );
};


export default ExtractedContentPage;
