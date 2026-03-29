import React, { useState, useEffect, useMemo } from 'react';
import CompanyForm from '../../components/CompanyForm/CompanyForm';
import CompanyControls from '../../components/CompanyControls/CompanyControls';
import CompanyList from '../../components/CompanyList/CompanyList';
import './CompanyTracker.css';

const API_URL = process.env.REACT_APP_API_URL;

function CompanyTracker() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Due Date');

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

  const handleAddCompany = async (newCompanyData) => {
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanyData)
      });
      
      if (!response.ok) throw new Error('Failed to add company');
      
      await fetchCompanies(); // Refresh the list
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

  const displayedCompanies = useMemo(() => {
    let filteredList = companies;

    if (filter !== 'All') {
        filteredList = companies.filter(company => company.status === filter);
    }
    
    return [...filteredList].sort((a, b) => {
        if (sortBy === 'Due Date') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
  }, [companies, filter, sortBy]);

  return (
    <div className="tracker-container">
      <h1>Company Application Tracker</h1>

      {error && <div className="error-message">{error}</div>}

      <CompanyForm onAddCompany={handleAddCompany} />

      <CompanyControls 
        filter={filter} 
        onFilterChange={setFilter} 
        sortBy={sortBy} 
        onSortChange={setSortBy} 
      />

      <CompanyList 
        companies={displayedCompanies} 
        loading={loading}
        onUpdateStatus={handleStatusChange}
        onDelete={handleDeleteCompany}
      />
    </div>
  );
}

export default CompanyTracker;
