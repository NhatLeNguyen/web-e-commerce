import React, { useEffect, useState } from "react";
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
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  month: string;
  visitors: number;
  pageViews: number;
}

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
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Visitors",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        barThickness: 10,
        borderRadius: 5,
      },
      {
        label: "Page Views",
        data: [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        barThickness: 10,
        borderRadius: 5,
      },
    ],
  });

  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/analytics");
        const analyticsData: AnalyticsData[] = response.data as AnalyticsData[];
        const labels = analyticsData.map((entry) => entry.month);
        const visitorsData = analyticsData.map((entry) => entry.visitors);
        const pageViewsData = analyticsData.map((entry) => entry.pageViews);

        setData({
          labels,
          datasets: [
            {
              label: "Visitors",
              data: visitorsData,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              barThickness: 10,
              borderRadius: 5,
            },
            {
              label: "Page Views",
              data: pageViewsData,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              barThickness: 10,
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

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
    <Box>
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
