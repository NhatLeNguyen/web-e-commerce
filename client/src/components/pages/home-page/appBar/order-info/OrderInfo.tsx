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
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/stores";
import {
  fetchUserOrders,
  updateOrderStatus,
} from "../../../../../redux/orders/orderThunks";
import { styled } from "@mui/material/styles";
import AppTheme from "../../../../themes/auth-themes/AuthTheme";
import ColorModeSelect from "../../../../themes/auth-themes/ColorModeSelect";
import { NumericFormat } from "react-number-format";
import Dot from "../../../../@extended/Dot";
import InfoIcon from "@mui/icons-material/Info";
import { format } from "date-fns";

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
  paymentMethod: string;
}

const ModernContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  minHeight: "100vh",
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(10),
  },
}));

const CustomCard = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "1200px",
  },
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
  },
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[900],
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
    },
  }),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  textAlign: "center",
  marginBottom: theme.spacing(4),
  letterSpacing: "0.5px",
  background: "linear-gradient(90deg, #00ddeb, #ff00ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.8rem",
  },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    fontWeight: 600,
    borderBottom: `2px solid ${theme.palette.divider}`,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.grey[50],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[700],
      }),
    },
  },
  "& .MuiDataGrid-cell": {
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    minHeight: "40px",
  },
}));

const OrdersInfo: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders({ userId: user._id }));
    }
  }, [user, dispatch]);

  const handleDetailClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmReceipt = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 3 }))
      .unwrap()
      .then(() => {
        if (user) {
          dispatch(fetchUserOrders({ userId: user._id }));
        }
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
        alert("Failed to update order status. Please try again.");
      });
    handleClose();
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
      renderCell: (params) =>
        format(new Date(params.value), "dd/MM/yyyy HH:mm"),
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
      <ModernContainer>
        <StyledTitle variant="h4">Your Orders</StyledTitle>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10}>
            <CustomCard>
              <Box sx={{ height: 800, width: "100%" }}>
                <StyledDataGrid
                  rows={orders}
                  columns={columns}
                  getRowId={(row) => row._id}
                  paginationModel={{ pageSize, page: 0 }}
                  onPaginationModelChange={(model: GridPaginationModel) =>
                    setPageSize(model.pageSize)
                  }
                  disableRowSelectionOnClick
                  loading={status === "loading"}
                />
              </Box>
            </CustomCard>
          </Grid>
        </Grid>
      </ModernContainer>
      <OrderDetailModal
        open={open}
        order={selectedOrder}
        handleClose={handleClose}
        handleConfirmReceipt={handleConfirmReceipt}
      />
    </AppTheme>
  );
};

const OrderDetailModal: React.FC<{
  open: boolean;
  order: Order | null;
  handleClose: () => void;
  handleConfirmReceipt: (orderId: string) => void;
}> = ({ open, order, handleClose, handleConfirmReceipt }) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: "#1e88e5" }}>
        Order Details
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Products
        </Typography>
        <List sx={{ bgcolor: "#f9fafb", borderRadius: "8px", padding: 2 }}>
          {order.products.map((product, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt={product.name}
                    src={product.imageUrl}
                    sx={{ borderRadius: "8px", width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={500}>
                      {product.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      {product.size && (
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            Size: {product.size}
                          </Typography>
                          <br />
                        </>
                      )}
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
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

        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Customer Information
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Name
                </TableCell>
                <TableCell>{order.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Email
                </TableCell>
                <TableCell>{order.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Phone
                </TableCell>
                <TableCell>{order.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Address
                </TableCell>
                <TableCell>{order.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Order Time
                </TableCell>
                <TableCell>
                  {format(new Date(order.orderTime), "dd/MM/yyyy HH:mm")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Note
                </TableCell>
                <TableCell>{order.note}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Status
                </TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  Payment Method
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ mt: 4, mb: 1, fontWeight: 600 }}>
          Total Amount
        </Typography>
        <Typography variant="h5" color="primary">
          <NumericFormat
            value={order.totalAmount}
            displayType="text"
            thousandSeparator
            prefix="$"
          />
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        {order.status === 1 && (
          <Button
            onClick={() => handleConfirmReceipt(order._id)}
            variant="contained"
            color="primary"
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Confirm Receipt
          </Button>
        )}
        <Button
          onClick={handleClose}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
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
      sx={{
        height: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <Dot
        color={color}
        sx={{
          width: 10,
          height: 10,
          marginRight: "4px",
        }}
      />
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          lineHeight: 1,
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

export default OrdersInfo;
