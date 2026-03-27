import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './NeumorphicSelect.css';

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

export default NeumorphicSelect;
