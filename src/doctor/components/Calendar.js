// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// export default function Calendar() {
// return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//     <DateCalendar />
//     </LocalizationProvider>
// );
// }

// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

// export default function Calendar() {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div
//         style={{
//           transform: "scale(0.5)",
//           transformOrigin: "top center"
//         }}
//       >
//         <DateCalendar
//           sx={{
//             "& .Mui-selected": {
//               backgroundColor: "#0AA5A5 !important"
//             },
//             "& .MuiPickersDay-today": {
//               borderColor: "#0AA5A5 !important"
//             }
//           }}
//         />
//       </div>
//     </LocalizationProvider>
//   );
// }

import React, { useState } from "react";

const Calendar = () => {
  // Initialize with the current real-time date
  const today = new Date();
  const [currDate, setCurrDate] = useState(today);

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  
  // Logic to calculate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrDate(new Date(year, month - 1));
  const nextMonth = () => setCurrDate(new Date(year, month + 1));

  return (
    <div style={containerStyle}>
      {/* Header with Navigation */}
      <div style={headerStyle}>
        <div style={monthYearStyle}>
          <span style={monthTextStyle}>{months[month]}</span>
          <span style={yearTextStyle}>{year}</span>
        </div>
        <div style={navStyle}>
          <button onClick={prevMonth} style={btnStyle}>{"<"}</button>
          <button onClick={nextMonth} style={btnStyle}>{">"}</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={gridStyle}>
        {days.map((d, i) => (
          <div key={i} style={dayHeaderStyle}>{d}</div>
        ))}
        
        {/* Fill empty slots for start of month */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Render Days */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          
          // Check if this specific day is "Today"
          const isToday = 
            day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear();

          return (
            <div 
              key={day} 
              style={isToday ? selectedDayStyle : dayStyle}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  width: "100%",
  fontFamily: "'Inter', sans-serif",
  color: "#1e293b"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const monthYearStyle = {
  display: "flex",
  flexDirection: "column",
  textAlign: "left"
};

const monthTextStyle = {
  color: "#93c5fd", // Light blue like your screenshot
  fontSize: "14px",
  fontWeight: "600"
};

const yearTextStyle = {
  color: "#93c5fd",
  fontSize: "14px"
};

const navStyle = {
  display: "flex",
  gap: "20px"
};

const btnStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "18px",
  color: "#64748b",
  fontWeight: "bold",
  padding: "5px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
  textAlign: "center"
};

const dayHeaderStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: "500",
  paddingBottom: "10px"
};

const dayStyle = {
  fontSize: "13px",
  padding: "8px 0",
  color: "#475569"
};

const selectedDayStyle = {
  ...dayStyle,
  background: "#0AA5A5", // Your Teal color
  color: "#fff",
  borderRadius: "10px",
  fontWeight: "bold"
};

export default Calendar;