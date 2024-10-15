import React, { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/stores";
import StatisticsCard from "./StatisticsCard";
import { fetchAllUsers } from "../../../../redux/users/userThunks";
import { fetchProducts } from "../../../../redux/products/productsThunk";
import { fetchOrders } from "../../../../redux/orders/orderThunks";
import OrderStatisticsChart from "./OrderStatisticsChart";
import VisitorsPageViewsChart from "./VisitorsPageViewsChart";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: users } = useSelector((state: RootState) => state.user);
  const { items: products } = useSelector((state: RootState) => state.products);
  const { orders } = useSelector((state: RootState) => state.orders);
  const [orderData] = useState({
    pending: [12, 19, 3, 5, 2, 3, 7],
    rejected: [2, 3, 20, 5, 1, 4, 2],
    approved: [3, 10, 13, 15, 22, 30, 75],
    succeed: [5, 2, 3, 10, 8, 12, 15],
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const totalEarnings = orders
    .filter((order) => order.status === 3)
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Products"
            count={totalProducts.toString()}
            percentage={10}
            isLoss={false}
            extra={`${totalProducts} products`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Users"
            count={totalUsers.toString()}
            percentage={5}
            isLoss={false}
            extra={`${totalUsers} users`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Orders"
            count={totalOrders.toString()}
            percentage={15}
            isLoss={false}
            extra={`${totalOrders} orders`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Earnings"
            count={`$${totalEarnings.toString()}`}
            percentage={20}
            isLoss={false}
            extra={`$${totalEarnings}`}
          />
        </Grid>
        <Grid item xs={6}>
          <VisitorsPageViewsChart />
        </Grid>
        <Grid item xs={6}>
          <OrderStatisticsChart data={orderData} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
