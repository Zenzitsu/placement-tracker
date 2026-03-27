import React from 'react';
import NeumorphicSelect from '../NeumorphicSelect/NeumorphicSelect';
import './CompanyList.css';

const CompanyList = ({ companies, loading, onUpdateStatus, onDelete }) => {
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
    <div className="company-list">
      <h2>My Applications</h2>
      {loading ? (
        <p>Loading companies...</p>
      ) : (
        <table>
          <thead>
            <tr className='table-head'>
              <th>Company</th>
              <th>Role</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr key={company.id} className={getDueDateClass(company.dueDate)}>
                  <td>{company.name}</td>
                  <td>{company.role}</td>
                  <td>{company.dueDate}</td>
                  <td className='neumorphic-select'>
                    <NeumorphicSelect 
                      options={['Interested', 'Applied', 'OA Eligible', 'Interviewing', 'Offer', 'Rejected', 'Ineligible']}
                      value={company.status}
                      onChange={(val) => onUpdateStatus(company.id, val)}
                    />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => onDelete(company.id)}>
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
  );
};

export default CompanyList;
