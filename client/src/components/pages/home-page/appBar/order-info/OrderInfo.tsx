import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardContent,
  CssBaseline,
  Stack,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/stores";
import { fetchUserOrders } from "../../../../../redux/orders/orderThunks";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../../themes/auth- themes/AuthTheme";
import ColorModeSelect from "../../../../themes/auth- themes/ColorModeSelect";
import { NumericFormat } from "react-number-format";
import Dot from "../../../../@extended/Dot";
import InfoIcon from "@mui/icons-material/Info";

const CustomCard = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "1200px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  backgroundColor: theme.palette.background.paper,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const columns: GridColDef[] = [
  { field: "_id", headerName: "Tracking No.", width: 220, sortable: true },
  { field: "name", headerName: "Product Name", width: 150, sortable: true },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    sortable: true,
    renderCell: (params) => <OrderStatus status={params.value} />,
  },
  { field: "orderTime", headerName: "Order Time", width: 200, sortable: true },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 120,
    sortable: true,
    renderCell: (params) => (
      <NumericFormat
        value={params.value}
        displayType="text"
        thousandSeparator
        prefix="$"
      />
    ),
  },
  {
    field: "detail",
    headerName: "Detail",
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <IconButton
        color="primary"
        onClick={() => handleDetailClick(params.row._id)}
      >
        <InfoIcon />
      </IconButton>
    ),
  },
];

const OrdersInfo: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders({ userId: user._id }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log("User Orders:", orders);
    }
  }, [orders]);

  const handleDetailClick = (orderId: string) => {
    console.log("Detail button clicked for order ID:", orderId);
    // Add your logic to navigate to the order detail page or show a modal
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <ColorModeSelect />
      </Box>
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Your Orders
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10}>
            {" "}
            {/* Increase the width by changing md={8} to md={10} */}
            <CustomCard>
              <Box sx={{ height: 800, width: "100%" }}>
                <DataGrid
                  rows={orders}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={10}
                  rowsPerPageOptions={[10, 15, 20]}
                  disableSelectionOnClick
                  loading={status === "loading"}
                />
              </Box>
            </CustomCard>
          </Grid>
        </Grid>
      </Container>
    </AppTheme>
  );
};

function OrderStatus({ status }: { status: number }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = "warning";
      title = "Pending";
      break;
    case 1:
      color = "success";
      title = "Approved";
      break;
    case 2:
      color = "error";
      title = "Rejected";
      break;
    case 3:
      color = "primary";
      title = "Success";
      break;
    default:
      color = "primary";
      title = "None";
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default OrdersInfo;
