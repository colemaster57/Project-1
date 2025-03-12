import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const generateProcesses = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: `P${i + 1}`,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime); 
};

const SJF = () => {
  const [processes, setProcesses] = useState(generateProcesses(5));
  const [results, setResults] = useState([]);

  const runSJF = () => {
    const newProcesses = generateProcesses(5);
    setProcesses(newProcesses);
    
    let currentTime = 0;
    let completionTimes = [];
    let remainingProcesses = [...newProcesses];

    while (remainingProcesses.length > 0) {
      let availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

      if (availableProcesses.length === 0) {
        
        currentTime = remainingProcesses[0].arrivalTime;
        availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
      }

      availableProcesses.sort((a, b) => a.burstTime - b.burstTime); 
      let shortestJob = availableProcesses[0]; 

      currentTime += shortestJob.burstTime;
      completionTimes.push({ ...shortestJob, completionTime: currentTime });

      
      remainingProcesses = remainingProcesses.filter(p => p.id !== shortestJob.id);
    }

    setResults(completionTimes); 
  };

  const clearChart = () => {
    setProcesses([]);
    setResults([]);
  };

  return (
    <div style={{ width: "500px", height: "400px", overflow: "hidden" }}>
      <h3>SJF Scheduling</h3>
      <button onClick={runSJF}>Run SJF</button>
      <button onClick={clearChart}>Clear</button>
      <Bar
        data={{
          labels: results.map((p) => `P${p.id}`),
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

export default SJF;
