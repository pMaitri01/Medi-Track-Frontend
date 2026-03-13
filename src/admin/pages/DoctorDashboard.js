// import DoctorHeader from "../components/DoctorHeader";
// import DoctorNavbar from "../components/DoctorNavbar";
// import DoctorFooter from "../components/DoctorFooter";
// import React from 'react'

// export default function DoctorDashboard() {
//   return (
//     <div>
//         <DoctorNavbar />
//         <DoctorHeader/>
//         <DoctorFooter/>
//     </div>
//   )
// }

import React, { useState } from "react";
import DoctorNavbar from "../components/DoctorNavbar"; // Adjust path as needed
import DoctorHeader from "../components/DoctorHeader";
import DoctorFooter from "../components/DoctorFooter";

export default function DoctorDashboard() {
  // 1. Create the state here
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* 2. Pass the state and the setter to Navbar so it can toggle */}
      <DoctorNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* 3. Pass the state to Header so it knows to shift left/right */}
      <DoctorHeader isCollapsed={isCollapsed} />
      
      {/* 4. The main content also needs a dynamic margin to avoid being hidden by the sidebar */}
      <main style={{ 
        marginLeft: isCollapsed ? "80px" : "100px", 
        transition: "margin-left 0.3s ease",
        padding: "20px",
        minHeight: "calc(100vh - 140px)" // Adjust based on header/footer height
      }}>
         <h1>Dashboard Content Goes Here</h1>
         {/* Your charts, tables, etc. */}
      </main>

      {/* 5. Pass the state to Footer */}
      <DoctorFooter isCollapsed={isCollapsed} />
    </div>
  );
}