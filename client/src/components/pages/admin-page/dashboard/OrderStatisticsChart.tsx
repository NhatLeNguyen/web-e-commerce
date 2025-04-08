import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrderStatisticsData {
  pending: number[];
  rejected: number[];
  approved: number[];
  succeed: number[];
}

const OrderStatisticsChart = ({ data }: { data: OrderStatisticsData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },

      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of Week",
          font: {
            size: 14,
          },
          padding: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Order Count",
          font: {
            size: 14,
          },
          padding: 10,
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 5,
        barThickness: 15,
      },
    },
  };

  const labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Pending",
        data: data.pending,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        hoverBackgroundColor: "rgba(255, 206, 86, 0.8)",
      },
      {
        label: "Rejected",
        data: data.rejected,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "Approved",
        data: data.approved,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        hoverBackgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Succeed",
        data: data.succeed,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  const totalOrders = [
    ...data.pending,
    ...data.rejected,
    ...data.approved,
    ...data.succeed,
  ].reduce((sum, value) => sum + value, 0);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Weekly Order Statistics
        </Typography>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          Total Orders: {totalOrders}
        </Typography>
        <Bar options={options} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default OrderStatisticsChart;
