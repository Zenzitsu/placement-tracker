import React, { useState } from 'react';
import NeumorphicSelect from '../NeumorphicSelect/NeumorphicSelect';
import NeumorphicDatePicker from '../NeumorphicDatePicker/NeumorphicDatePicker';
import './CompanyForm.css';

const CompanyForm = ({ onAddCompany }) => {
  const [newCompany, setNewCompany] = useState({
    name: '',
    role: '',
    dueDate: '',
    status: 'Interested', // Default status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleStatusChange = (val) => {
    setNewCompany({ ...newCompany, status: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.role || !newCompany.dueDate) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Pass the data up to the parent to handle API call
    onAddCompany(newCompany);
    
    // Reset form
    setNewCompany({ name: '', role: '', dueDate: '', status: 'Interested' });
  };

  return (
    <form onSubmit={handleSubmit} className="add-company-form">
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
        onChange={handleStatusChange}
        placeholder="Select Status"
      />
      <button type="submit">Add Company</button>
    </form>
  );
};

export default CompanyForm;
