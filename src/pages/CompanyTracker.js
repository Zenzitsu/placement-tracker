import React, { useState, useEffect, useMemo } from 'react';
import './CompanyTracker.css';

const API_URL = 'http://localhost:5000/api';

function CompanyTracker() {
  // State for the list of companies
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the form inputs
  const [newCompany, setNewCompany] = useState({
    name: '',
    role: '',
    dueDate: '',
    status: 'Interested', // Default status
  });
  
  // Extra Features: State for sorting and filtering
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  // Fetch companies from backend when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.role || !newCompany.dueDate) {
      alert('Please fill in all fields.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      
      if (!response.ok) throw new Error('Failed to add company');
      
      await fetchCompanies(); // Refresh the list
      setNewCompany({ name: '', role: '', dueDate: '', status: 'Interested' }); // Reset form
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error adding company:', err);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const response = await fetch(`${API_URL}/companies/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete company');
      
      await fetchCompanies(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting company:', err);
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update company');
      
      await fetchCompanies(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error updating company:', err);
    }
  };

  // Extra Feature: Memoized calculation for filtered and sorted companies
  const displayedCompanies = useMemo(() => {
    let filteredList = companies;

    if (filter !== 'All') {
        filteredList = companies.filter(company => company.status === filter);
    }
    
    return [...filteredList].sort((a, b) => {
        if (sortBy === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
  }, [companies, filter, sortBy]);
  
  // Extra Feature: Highlight due dates
  const getDueDateClass = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0,0,0,0); // Normalize today's date
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'past-due';
    if (diffDays <= 3) return 'due-soon';
    return '';
  };


  return (
    <div className="tracker-container">
      <h1>Company Application Tracker</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddCompany} className="add-company-form">
        <h2>Add New Opportunity</h2>
        <input
          type="text"
          name="name"
          value={newCompany.name}
          onChange={handleInputChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="role"
          value={newCompany.role}
          onChange={handleInputChange}
          placeholder="Role (e.g., SDE Intern)"
          required
        />
        <input
          type="date"
          name="dueDate"
          value={newCompany.dueDate}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={newCompany.status} onChange={handleInputChange}>
          <option value="Interested">Interested</option>
          <option value="Applied">Applied</option>
          <option value="OA Eligible">OA Eligible</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Ineligible">Ineligible</option>
        </select>
        <button type="submit">Add Company</button>
      </form>

      <div className="controls">
          <div className="filter-sort">
            <label>Filter by Status:</label>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="All">All</option>
                <option value="Interested">Interested</option>
                <option value="Applied">Applied</option>
                <option value="OA Eligible">OA Eligible</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Ineligible">Ineligible</option>
            </select>
          </div>
          <div className="filter-sort">
            <label>Sort by:</label>
            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                <option value="dueDate">Due Date</option>
                <option value="name">Company Name</option>
            </select>
          </div>
      </div>

      <div className="company-list">
        <h2>My Applications</h2>
        {loading && <p>Loading companies...</p>}
        {!loading && (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCompanies.length > 0 ? (
              displayedCompanies.map((company) => (
                <tr key={company.id} className={getDueDateClass(company.dueDate)}>
                  <td>{company.name}</td>
                  <td>{company.role}</td>
                  <td>{company.dueDate}</td>
                  <td>
                    <select value={company.status} onChange={(e) => handleStatusChange(company.id, e.target.value)}>
                        <option value="Interested">Interested</option>
                        <option value="Applied">Applied</option>
                        <option value="OA Eligible">OA Eligible</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Ineligible">Ineligible</option>
                    </select>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteCompany(company.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No companies added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default CompanyTracker;
