import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const generateProcesses = (num) => {
    return Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 10) + 1,
        remainingTime: Math.floor(Math.random() * 10) + 1,
    })).sort((a, b) => a.arrivalTime - b.arrivalTime);
};

const STCF = () => {
    const [processes, setProcesses] = useState(generateProcesses(5));
    const [results, setResults] = useState([]);

    const runSTCF = () => {
        const newProcess = generateProcesses(5);
        setProcesses(newProcess);
        let currentTime = 0;
        let completionTimes = [];
        let remainingProcesses = [...newProcess];

        while (remainingProcesses.length > 0) {
            let availableProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);

            if (availableProcesses.length === 0) {
                currentTime = remainingProcesses[0].arrivalTime;
                continue;
            }

            availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
            let shortestJob = availableProcesses[0];
            shortestJob.remainingTime--;
            currentTime++;

            if (shortestJob.remainingTime === 0) {
                completionTimes.push({ ...shortestJob, completionTime: currentTime });
                remainingProcesses = remainingProcesses.filter(p => p.id !== shortestJob.id);
            }
        }
        setResults(completionTimes);
    };

    const clearChart = () => {
        setProcesses([]);
        setResults([]);
    };

    return (
        <div style={{ width: "500px", height: "400px", overflow: "hidden" }}>
            <h3>STCF Scheduling</h3>
            <button onClick={runSTCF}>Run STCF</button>
            <button onClick={clearChart}>Clear</button>
            <Bar
                data={{
                    labels: results.map((p) => `P${p.id}`),
                    datasets: [
                        {
                            label: "Completion Time",
                            data: results.map((p) => p.completionTime),
                            backgroundColor: "rgba(15, 150, 190, 0.6)",
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                }}
                style={{ width: "40px", height: "30px" }}
            />
        </div>
    );
};

export default STCF;