import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = () => {
  // State to hold the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format the selected date as ISO string (yyyy-MM-dd)
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Convert the date to ISO format (yyyy-MM-dd)
    const isoDate = date.toISOString().split('T')[0]; // Extracts only the date part
    console.log("Selected Date in ISO format:", isoDate);

    // Now you can send `isoDate` to your backend
    // Example of sending to backend:
    // fetch('/your-backend-endpoint', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     date: isoDate, // Send the ISO format date
    //   }),
    // });
  };

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        className="text-black"
        dateFormat="dd-MM-yyyy"  // Local display format
        inline  // Keeps the calendar always visible
      />
    </div>
  );
};

export default DateTimePicker;
