import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './NeumorphicDatePicker.css';

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
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
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

export default NeumorphicDatePicker;
