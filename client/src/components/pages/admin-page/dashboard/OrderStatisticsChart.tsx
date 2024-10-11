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
      },
      title: {
        display: true,
        text: "Order Statistics",
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
        backgroundColor: "rgba(255, 193, 7, 0.5)",
      },
      {
        label: "Rejected",
        data: data.rejected,
        backgroundColor: "rgba(244, 67, 54, 0.5)",
      },
      {
        label: "Approved",
        data: data.approved,
        backgroundColor: "rgba(76, 175, 80, 0.5)",
      },
      {
        label: "Succeed",
        data: data.succeed,
        backgroundColor: "rgba(33, 150, 243, 0.5)",
      },
    ],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Weekly Order Statistics
        </Typography>
        <Bar options={options} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default OrderStatisticsChart;
