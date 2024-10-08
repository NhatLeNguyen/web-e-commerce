import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardContent,
  CssBaseline,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
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

interface Product {
  name: string;
  price: number;
  imageUrl: string;
  size?: string;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderTime: string;
  note: string;
  status: number;
  products: Product[];
  totalAmount: number;
}

const OrdersInfo: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const handleDetailClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

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
    {
      field: "orderTime",
      headerName: "Order Time",
      width: 200,
      sortable: true,
    },
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
          onClick={() => handleDetailClick(params.row as Order)}
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

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
      <OrderDetailModal
        open={open}
        order={selectedOrder}
        handleClose={handleClose}
      />
    </AppTheme>
  );
};

const OrderDetailModal: React.FC<{
  open: boolean;
  order: Order | null;
  handleClose: () => void;
}> = ({ open, order, handleClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Products
        </Typography>
        <List>
          {order.products.map((product, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={product.name} src={product.imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={
                    <>
                      {product.size && (
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            Size: {product.size}
                          </Typography>
                          <br />
                        </>
                      )}
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        Price:{" "}
                        <NumericFormat
                          value={product.price}
                          displayType="text"
                          thousandSeparator
                          prefix="$"
                        />
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < order.products.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Customer Information
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Name
                </TableCell>
                <TableCell>{order.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Email
                </TableCell>
                <TableCell>{order.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Phone
                </TableCell>
                <TableCell>{order.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Address
                </TableCell>
                <TableCell>{order.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Order Time
                </TableCell>
                <TableCell>{order.orderTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Note
                </TableCell>
                <TableCell>{order.note}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Status
                </TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Total Amount
        </Typography>
        <Typography>
          <NumericFormat
            value={order.totalAmount}
            displayType="text"
            thousandSeparator
            prefix="$"
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
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
      sx={{ width: "100%", height: "100%" }}
    >
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

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

export default OrdersInfo;
