import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const generateProcesses = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);
};

const FIFO = () => {
  const [processes, setProcesses] = useState(generateProcesses(5));
  const [results, setResults] = useState([]);

  const runFIFO = () => {
    const newProcess = generateProcesses(5);
    setProcesses(newProcess);
    let currentTime = 0;
    let completionTimes = [];
    


    processes.forEach((process) => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }
      currentTime += process.burstTime;
      completionTimes.push({ ...process, completionTime: currentTime });
    });

    setResults(completionTimes);
    
  };
  const clearChart = () => {
    //completionTimes = [];
    setResults([])
  }

  return (
    <div style = {{width:"500px", height: "400px", overflow: "hidden"}}>
      <h2>FIFO Scheduling</h2>
      <button onClick={runFIFO}>Run FIFO</button>
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
            responsive:true, maintainAspectRatio: false,
        }}
        style = {{width: "40px", height: "30px"}}
      />
    </div>
  );
};

export default FIFO;