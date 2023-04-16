import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data: number[];
  labels: string[];
  seriesLabel: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  seriesLabel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart>();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      return;
    }

    const chart = (chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }));
    return () => {
      chart.destroy();
      chartRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;

    if (chart == null) {
      return;
    }

    chart.data.labels = labels;
    chart.data.datasets = [
      {
        label: seriesLabel,
        data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ];
    chart.update();

  }, [data, labels, seriesLabel]);

  return <canvas ref={canvasRef}></canvas>;
};
