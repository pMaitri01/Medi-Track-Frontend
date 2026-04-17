import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenderChart() {
  const [data, setData] = useState({
    male: 0,
    female: 0,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/doctor/gender`, {
        method: "GET",
      headers: {
        // Authorization: "Bearer " + localStorage.getItem("token"),
      },
              credentials: "include",

    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch((err) => console.log(err));
  }, []);

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Patients",
        data: [data.male, data.female],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
  plugins: {
    legend: {
      position: "right",
    },
  },
};

  return (
    // <div style={{ width: "300px", margin: "auto" }}>
    <div style={{ width: "100%", height: "250px" }}>
      {/* <h3 style={{ textAlign: "center" }}>Patient Gender</h3> */}
      <Pie data={chartData} options={options} />
    </div>
  );
}