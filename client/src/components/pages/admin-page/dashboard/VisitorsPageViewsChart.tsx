import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Tabs, Tab, Box, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    barThickness?: number;
    borderRadius?: number;
  }[];
}

const VisitorsPageViewsChart = () => {
  const [tab, setTab] = useState(0);

  const mockData = [
    { month: "Jan", visitors: 12, pageViews: 450 },
    { month: "Feb", visitors: 15, pageViews: 480 },
    { month: "Mar", visitors: 20, pageViews: 600 },
    { month: "Apr", visitors: 18, pageViews: 550 },
    { month: "May", visitors: 22, pageViews: 620 },
    { month: "Jun", visitors: 25, pageViews: 700 },
    { month: "Jul", visitors: 30, pageViews: 800 },
    { month: "Aug", visitors: 28, pageViews: 750 },
    { month: "Sep", visitors: 26, pageViews: 720 },
    { month: "Oct", visitors: 31, pageViews: 850 },
    { month: "Nov", visitors: 35, pageViews: 500 },
    { month: "Dec", visitors: 40, pageViews: 500 },
  ];

  const data: ChartData = {
    labels: mockData.map((entry) => entry.month),
    datasets: [
      {
        label: "Visitors",
        data: mockData.map((entry) => entry.visitors),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        barThickness: 10,
        borderRadius: 5,
      },
      {
        label: "Page Views",
        data: mockData.map((entry) => entry.pageViews),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        barThickness: 10,
        borderRadius: 5,
      },
    ],
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: tab === 0 ? "Visitors Statistics" : "Page Views Statistics",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  const totalVisitors = data.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalPageViews = data.datasets[1].data.reduce((a, b) => a + b, 0);

  return (
    <Box sx={{ borderRadius: 2, boxShadow: 1, padding: 2 }}>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Visitors" />
        <Tab label="Page Views" />
      </Tabs>
      <Typography variant="h6" align="center" gutterBottom>
        {tab === 0
          ? `Total Visitors: ${totalVisitors}`
          : `Total Page Views: ${totalPageViews}`}
      </Typography>
      <Bar
        data={{
          labels: data.labels,
          datasets: [data.datasets[tab]],
        }}
        options={options}
      />
    </Box>
  );
};

export default VisitorsPageViewsChart;
