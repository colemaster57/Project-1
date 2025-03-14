import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const generateProcesses = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: Math.floor(Math.random() * 20) + 1,
    remainingTime: 0, // Will be set later
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);
};

const MLFQ = () => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState([]);

  const timeQuantum1 = 4;
  const timeQuantum2 = 8;

  const runMLFQ = () => {
    const newProcesses = generateProcesses(numProcesses).map((p) => ({
      ...p,
      remainingTime: p.burstTime,
    }));

    let queue1 = [...newProcesses]; // Highest Priority
    let queue2 = [];
    let queue3 = [];
    let time = 0;
    let completionTimes = [];

    while (queue1.length > 0 || queue2.length > 0 || queue3.length > 0) {
      let process = null;

      // Execute from highest priority queue first
      if (queue1.length > 0) {
        process = queue1.shift();
        let executionTime = Math.min(timeQuantum1, process.remainingTime);
        process.remainingTime -= executionTime;
        time += executionTime;

        if (process.remainingTime > 0) {
          queue2.push(process); // Move to lower priority queue
        } else {
          completionTimes.push({ ...process, completionTime: time });
        }
      } else if (queue2.length > 0) {
        process = queue2.shift();
        let executionTime = Math.min(timeQuantum2, process.remainingTime);
        process.remainingTime -= executionTime;
        time += executionTime;

        if (process.remainingTime > 0) {
          queue3.push(process); // Move to lowest priority queue
        } else {
          completionTimes.push({ ...process, completionTime: time });
        }
      } else if (queue3.length > 0) {
        process = queue3.shift();
        time += process.remainingTime;
        process.remainingTime = 0;
        completionTimes.push({ ...process, completionTime: time });
      }
    }

    setProcesses(newProcesses);
    setResults(completionTimes);
  };

  return (
    <div style={{ width: "500px", height: "400px", overflow: "hidden" }}>
      <h2>Multi-Level Feedback Queue (MLFQ) Scheduling</h2>
      <label>
        Number of Processes:{" "}
        <input
          type="number"
          value={numProcesses}
          onChange={(e) => setNumProcesses(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button onClick={runMLFQ}>Run MLFQ</button>
      <Bar
        data={{
          labels: results.map((p) => `P${p.id}`),
          datasets: [
            {
              label: "Completion Time",
              backgroundColor: "rgba(110, 3, 78, 0.6)",
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

export default MLFQ;