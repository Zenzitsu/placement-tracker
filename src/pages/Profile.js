import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
  // State for personal details
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : { name: '', email: '', phone: '', portfolio: '' };
  });

  // State for documents
  const [documents, setDocuments] = useState(() => {
    const savedDocs = localStorage.getItem('documents');
    return savedDocs ? JSON.parse(savedDocs) : [];
  });
  
  const [fileInput, setFileInput] = useState(null);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);
  
  // Save documents to localStorage
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleFileChange = (e) => {
      if (e.target.files[0]) {
          setFileInput(e.target.files[0]);
      }
  };
  
  const handleAddDocument = () => {
      if (!fileInput) {
          alert("Please select a file first.");
          return;
      }
      const newDoc = {
          id: Date.now(),
          name: fileInput.name,
          type: fileInput.type,
          size: (fileInput.size / 1024).toFixed(2) + ' KB', // Size in KB
      };
      setDocuments([...documents, newDoc]);
      // Clear the file input after adding
      document.getElementById('file-upload').value = '';
      setFileInput(null);
  };
  
  const handleDeleteDocument = (id) => {
      setDocuments(documents.filter(doc => doc.id !== id));
  };


  return (
    <div className="profile-container">
      <h1>My Profile & Documents</h1>

      <div className="profile-details">
        <h2>Personal Information</h2>
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

