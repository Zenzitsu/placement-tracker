import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Trash2, Calendar, ChevronDown } from 'lucide-react';
import './CompanyTracker.css';

const API_URL = 'http://localhost:5000/api';

// --- CUSTOM NEUMORPHIC DROPDOWN ---
const NeumorphicSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="neo-select-container" ref={dropdownRef}>
      <div 
        className={`neo-select-header ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={18} className={`neo-chevron ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <ul className="neo-select-list">
          {options.map((option) => (
            <li 
              key={option} 
              className={`neo-select-item ${value === option ? 'selected' : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- CUSTOM NEUMORPHIC DATE WRAPPER ---
// --- FULLY CUSTOM NEUMORPHIC DATE PICKER ---
const NeumorphicDatePicker = ({ name, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dateRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions for calendar logic
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateSelect = (day) => {
    // Format to YYYY-MM-DD to match native input behavior
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    
    // Simulate an event object so your existing onChange handler works
    onChange({ target: { name, value: `${year}-${month}-${formattedDay}` } });
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="neo-date-wrapper" ref={dateRef}>
      <div 
        className={`neo-select-header ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? value : "Select Date"}</span>
        <Calendar size={18} className="neo-calendar-icon" />
      </div>

      {isOpen && (
        <div className="neo-calendar-popup">
          <div className="neo-calendar-header">
            <button type="button" onClick={() => changeMonth(-1)}>&lt;</button>
            <span>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button type="button" onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          
          <div className="neo-calendar-grid days-header">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          
          <div className="neo-calendar-grid">
            {blanks.map(blank => <div key={`blank-${blank}`} className="neo-calendar-day empty"></div>)}
            {days.map(day => {
                // Check if this is the currently selected date
                const isSelected = value === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                return (
                    <div 
                        key={day} 
                        className={`neo-calendar-day ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(day)}
                    >
                        {day}
                    </div>
                )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [sortBy, setSortBy] = useState('Due Date');

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
        if (sortBy === 'Due Date') {
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
        <NeumorphicDatePicker 
          name="dueDate" 
          value={newCompany.dueDate} 
          onChange={handleInputChange} 
        />
        <NeumorphicSelect 
          options={['Interested', 'Applied', 'OA Eligible', 'Interviewing', 'Offer', 'Rejected', 'Ineligible']}
          value={newCompany.status}
          onChange={(val) => setNewCompany({ ...newCompany, status: val })}
          placeholder="Select Status"
        />
        <button type="submit">Add Company</button>
      </form>

      <div className="controls">
          <div className="filter-sort">
            <label>Filter by Status:</label>
            <NeumorphicSelect 
              options={['All', 'Interested', 'Applied', 'OA Eligible', 'Interviewing', 'Offer', 'Rejected', 'Ineligible']}
              value={filter}
              onChange={(val) => setFilter(val)}
              placeholder="All"
            />
          </div>
          <div className="filter-sort">
            <label>Sort by:</label>
            <NeumorphicSelect 
              options={["Due Date", "Company Name"]}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              placeholder="Sort by"
            />
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
                    <NeumorphicSelect 
                      options={['Interested', 'Applied', 'OA Eligible', 'Interviewing', 'Offer', 'Rejected', 'Ineligible']}
                      value={company.status}
                      onChange={(val) => handleStatusChange(company.id, val)}
                    />
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
