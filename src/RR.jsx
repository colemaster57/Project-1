import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const generateProcesses = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 10) + 1,
    remainingTime: 0, // Will be set later
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);
};

const RoundRobin = () => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);

  const runRoundRobin = () => {
    const newProcesses = generateProcesses(numProcesses).map((p) => ({
      ...p,
      remainingTime: p.burstTime,
    }));

    let queue = [...newProcesses];
    let time = 0;
    let completionTimes = [];
    
    while (queue.length > 0) {
      let process = queue.shift();

      if (time < process.arrivalTime) {
        time = process.arrivalTime; // If CPU is idle, jump to process arrival time
      }

      let executionTime = Math.min(timeQuantum, process.remainingTime);
      process.remainingTime -= executionTime;
      time += executionTime;

      if (process.remainingTime > 0) {
        queue.push(process); // Requeue if it has remaining burst time
      } else {
        completionTimes.push({ ...process, completionTime: time });
      }
    }

    setProcesses(newProcesses);
    setResults(completionTimes);
  };

  return (
    <div style={{ width: "500px", height: "400px", overflow: "hidden" }}>
      <h2>Round Robin Scheduling</h2>
      <label>
        Number of Processes:{" "}
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value))}
        />
      </label>
      <br />
      <label>
        Time Quantum:{" "}
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button onClick={runRoundRobin}>Run Round Robin</button>
      <Bar
        data={{
          labels: results.map((p) => `P${p.id}`),
          datasets: [
            {
              label: "Completion Time",
              backgroundColor: "rgba(235, 54, 54, 0.6)",
              data: results.map((p) => p.completionTime),
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
};

export default RoundRobin;