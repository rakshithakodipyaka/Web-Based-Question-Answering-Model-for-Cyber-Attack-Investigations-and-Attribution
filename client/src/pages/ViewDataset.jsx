import React, { useEffect, useState } from 'react';
import './ViewDataset.css'; // Import the CSS

export default function ViewDataset() {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for pop-up visibility

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dataset');
        if (!response.ok) {
          throw new Error('Error fetching dataset');
        }
        const data = await response.json();
        console.log(data);  // Check the structure of the dataset
        setDataset(data.Sheet1 || []);  // Access the `Sheet1` array inside the JSON
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDataset();
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup); // Toggle pop-up visibility
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!dataset || dataset.length === 0) {
    return <div>No data available</div>;
  }

  const keys = dataset[0] ? Object.keys(dataset[0]) : [];

  return (
    <div>
      {/* Button to open the pop-up */}
      <button className="details-button" onClick={togglePopup}>
        Details
      </button>

      {/* Pop-up container */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <span className="close-icon" onClick={togglePopup}>
              &times; {/* Close icon */}
            </span>
            <p><h3>Total Records:</h3>  34<br></br>
            <h3>Fields per Record:</h3>  5<br></br>
            <h3>Field Names:</h3>  URL, Scraped Content, Summarized Content, Questions, Answers<br></br>
            <h3>Total no of urls:</h3>  34<br></br>
            <h3>No of questions for 1 url:</h3>  30<br></br>
            <h3>No of answers for 1 url:</h3>  30<br></br>
            <h3>Total no of questions:</h3>  1020<br></br>
            <h3>Total no of answers:</h3>  1020
            </p>
          </div>
        </div>
      )}

      {/* Dataset table */}
      <div className="dataset-container">
        <table className="dataset-table">
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.map((item, index) => (
              <tr key={index}>
                {keys.map((key) => (
                  <td key={key}>{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
