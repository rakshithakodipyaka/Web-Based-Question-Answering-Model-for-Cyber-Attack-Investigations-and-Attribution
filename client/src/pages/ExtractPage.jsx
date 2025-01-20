import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExtractPage.css';

const ExtractPage = () => {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleExtract = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
    
        try {
            const response = await fetch('http://localhost:8000/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (data.success) {
                // Pass both the content and the filename to the ExtractedContentPage
                navigate('/extracted-content', { state: { content: data.content, filename: data.filename } });
            } else {
                alert('Extraction failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error extracting content:', error);
            alert('Error occurred during extraction');
        }
    };
    

    return (
        <div className="extract-page">
            <h1>Enter URL for Content Extraction</h1>
            <form onSubmit={handleExtract}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button type="submit">Extract</button>
            </form>
        </div>
    );
};

export default ExtractPage;
