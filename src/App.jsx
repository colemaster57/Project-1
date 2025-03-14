import React, { useRef } from "react";
import jsPDF from "jspdf";
import FIFO from "./Fifo.jsx";
import Header from "./Header.jsx";
import SJF from "./SJF.jsx";
import STCF from "./STCF.jsx";
import RoundRobin from "./RR.jsx";
import MLFQ from "./MLFQ.jsx";

const App = () => {
  const fifoRef = React.useRef(null);
  const sjfRef = React.useRef(null);
  const stcfRef = React.useRef(null);
  const rrRef = React.useRef(null);
  const mlfqRef = React.useRef(null);

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    let yOffset = 20;

    doc.text("CPU Scheduling Report", 10, yOffset);
    yOffset += 10;

    const addChartToPDF = (chartRef, title) => {
      if (chartRef.current) {
        const chartCanvas = chartRef.current;
        const chartImage = chartCanvas.toBase64Image();
        doc.addPage();
        doc.text(title, 10, yOffset);
        doc.addImage(chartCanvas, "PNG", 10, yOffset + 10, 180, 80);
        yOffset += 110; // Move down for next chart
      }
    };

    addChartToPDF(fifoRef, "First Come First Serve (FCFS)");
    addChartToPDF(sjfRef, "Shortest Job First (SJF)");
    addChartToPDF(stcfRef, "Shortest Time to Completion First (STCF)");
    addChartToPDF(rrRef, "Round Robin (RR)");
    addChartToPDF(mlfqRef, "Multi-Level Feedback Queue (MLFQ)");

    doc.save("CPU_Scheduling_Report.pdf");
  };

  return (
    <div>
      <Header />
      <h1>CPU Scheduling Simulation</h1>
      
      <div>
        <FIFO ref={fifoRef} />
        <SJF ref={sjfRef} />
        <STCF ref={stcfRef} />
        <RoundRobin ref={rrRef} />
        <MLFQ ref={mlfqRef} />
        <button onClick={exportPDF}>Download Report</button>
      </div>
    </div>
  );
};

export default App;