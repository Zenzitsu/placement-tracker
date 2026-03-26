import React, { useState, useEffect } from 'react';
import './Profile.css';

const API_URL = 'http://localhost:5000/api';

function Profile() {
  // State for personal details
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', portfolio: '' });
  const [profileLoading, setProfileLoading] = useState(true);

  // State for documents
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  
  const [fileInput, setFileInput] = useState(null);
  const [error, setError] = useState(null);

  // Fetch profile and documents on component mount
  useEffect(() => {
    fetchProfile();
    fetchDocuments();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch(`${API_URL}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await fetch(`${API_URL}/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching documents:', err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleProfileChange = async (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);

    // Save to backend
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      
      if (!response.ok) throw new Error('Failed to save profile');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving profile:', err);
    }
  };
  
  const handleFileChange = (e) => {
      if (e.target.files[0]) {
          setFileInput(e.target.files[0]);
      }
  };
  
  const handleAddDocument = async () => {
      if (!fileInput) {
          alert("Please select a file first.");
          return;
      }
      
      try {
        const response = await fetch(`${API_URL}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fileInput.name,
            type: fileInput.type,
            size: (fileInput.size / 1024).toFixed(2) + ' KB'
          })
        });

        if (!response.ok) throw new Error('Failed to add document');

        await fetchDocuments(); // Refresh the list
        document.getElementById('file-upload').value = '';
        setFileInput(null);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error adding document:', err);
      }
  };
  
  const handleDeleteDocument = async (id) => {
      try {
        const response = await fetch(`${API_URL}/documents/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete document');

        await fetchDocuments(); // Refresh the list
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error deleting document:', err);
      }
  };


  return (
    <div className="profile-container">
      <h1>My Profile & Documents</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-details">
        <h2>Personal Information</h2>
        {profileLoading ? (
          <p>Loading profile...</p>
        ) : (
          <div className="profile-form">
            <label>Full Name:</label>
            <input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Your Name" />
            <label>Email Address:</label>
            <input type="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="your.email@example.com" />
            <label>Phone Number:</label>
            <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="123-456-7890" />
            <label>Portfolio/LinkedIn URL:</label>
            <input type="text" name="portfolio" value={profile.portfolio} onChange={handleProfileChange} placeholder="https://your-portfolio.com" />
          </div>
        )}
      </div>

      <div className="document-manager">
        <h2>Document Manager</h2>
        <p className="disclaimer">
          <strong>Note:</strong> This tool only saves the *names* of your files, not the files themselves. Your documents remain on your local computer.
        </p>
        <div className="upload-section">
            <input type="file" id="file-upload" onChange={handleFileChange} />
            <button onClick={handleAddDocument}>Add Document Reference</button>
        </div>
        
        <ul className="document-list">
        {documents.length > 0 ? documents.map(doc => (
            <li key={doc.id}>
                <div className="doc-info">
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-meta">{doc.type} - {doc.size}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteDocument(doc.id)}>Delete</button>
            </li>
        )) : (
            <p>No documents added yet. Upload your resume, cover letters, etc.</p>
        )}
        </ul>
      </div>
    </div>
  );
}

export default Profile;

