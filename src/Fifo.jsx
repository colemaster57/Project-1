import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const generateProcesses = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,  // P1, P2, P3 assigned in generation order
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime); // Ensure execution in FIFO order
};

const FIFO = () => {
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);

  const runFIFO = () => {
    const newProcesses = generateProcesses(5);
    setProcesses(newProcesses);

    let currentTime = 0;
    let completionTimes = [];

    newProcesses.forEach((process, index) => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }
      currentTime += process.burstTime;
      completionTimes.push({ id: index + 1, completionTime: currentTime }); 
    });

    setResults(completionTimes);
  };

  const clearChart = () => {
    setResults([]);
    setProcesses([]);
  };

  return (
    <div style={{ width: "500px", height: "400px", overflow: "hidden" }}>
      <h3>FIFO Scheduling</h3>
      <button onClick={runFIFO}>Run FIFO</button>
      <button onClick={clearChart}>Clear</button>
      <Bar
        data={{
          labels: results.map((p) => `P${p.id}`), // Ensuring proper process labeling
          datasets: [
            {
              label: "Completion Time",
              data: results.map((p) => p.completionTime),
              backgroundColor: "rgba(185, 15, 190, 0.6)",
            },
            
                
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default FIFO;
