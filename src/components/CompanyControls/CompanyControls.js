import React from 'react';
import NeumorphicSelect from '../NeumorphicSelect/NeumorphicSelect';
import './CompanyControls.css';

const CompanyControls = ({ filter, onFilterChange, sortBy, onSortChange }) => {
  return (
    <div className="controls">
      <div className="filter-sort">
        <label>Filter by Status:</label>
        <NeumorphicSelect 
          options={['All', 'Interested', 'Applied', 'OA Eligible', 'Interviewing', 'Offer', 'Rejected', 'Ineligible']}
          value={filter}
          onChange={onFilterChange}
          placeholder="All"
        />
      </div>
      <div className="filter-sort">
        <label>Sort by:</label>
        <NeumorphicSelect 
          options={["Due Date", "Company Name"]}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Sort by"
        />
      </div>
    </div>
  );
};

export default CompanyControls;
