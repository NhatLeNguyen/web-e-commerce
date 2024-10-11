import { Line } from "react-chartjs-2";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OrderSuccessData {
  monthly: number[];
}

const OrderSuccessLineChart = ({ data }: { data: OrderSuccessData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Order Success Statistics",
      },
    },
  };

  const monthlyLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Success Orders",
        data: data.monthly,
        borderColor: "rgba(33, 150, 243, 0.5)",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" style={{ marginTop: "20px" }}>
          Monthly Order Success Statistics
        </Typography>
        <Line options={options} data={monthlyData} />
      </CardContent>
    </Card>
  );
};

export default OrderSuccessLineChart;
