import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
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
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import Dot from "../../../@extended/Dot";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/stores";
import {
  fetchOrders,
  updateOrderStatus,
} from "../../../../redux/orders/orderThunks";
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

const OrderList: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const orderStatus = useSelector((state: RootState) => state.orders.status);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  const handleDetailClick = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleApprove = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 1 }));
    handleClose();
  };

  const handleReject = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 2 }));
    handleClose();
  };

  const handleConfirmSuccess = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 3 }));
    handleClose();
  };

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "Tracking No.",
      width: 250,
      sortable: true,
    },
    { field: "name", headerName: "Customer", width: 180, sortable: true },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      sortable: true,
      renderCell: (params) => <OrderStatus status={params.value} />,
    },
    { field: "email", headerName: "Email", width: 200, sortable: true },
    {
      field: "orderTime",
      headerName: "Order Time",
      width: 150,
      sortable: true,
      renderCell: (params) =>
        format(new Date(params.value), "dd/MM/yyyy HH:mm"),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
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
      field: "actions",
      headerName: "Details",
      type: "actions",
      width: 100,
      sortable: false,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<InfoIcon color="primary" />}
          label="Details"
          onClick={() => handleDetailClick(params.row as Order)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 800, width: "98%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 15, 20]}
        pagination
        disableSelectionOnClick
      />
      <OrderDetailModal
        open={open}
        order={selectedOrder}
        handleClose={handleClose}
        handleApprove={handleApprove}
        handleReject={handleReject}
        handleConfirmSuccess={handleConfirmSuccess}
        userRole={userRole}
      />
    </Box>
  );
};

const OrderDetailModal: React.FC<{
  open: boolean;
  order: Order | null;
  handleClose: () => void;
  handleApprove: (orderId: string) => void;
  handleReject: (orderId: string) => void;
  handleConfirmSuccess: (orderId: string) => void;
  userRole: string | undefined;
}> = ({
  open,
  order,
  handleClose,
  handleApprove,
  handleReject,
  handleConfirmSuccess,
  userRole,
}) => {
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
                <TableCell>
                  {format(new Date(order.orderTime), "dd/MM/yyyy HH:mm")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Note
                </TableCell>
                <TableCell>{order.note}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Payment Method
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
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
        {userRole === "admin" && order.status === 0 && (
          <>
            <Button onClick={() => handleApprove(order._id)} color="primary">
              Approve
            </Button>
            <Button onClick={() => handleReject(order._id)} color="secondary">
              Reject
            </Button>
          </>
        )}
        {userRole === "user" && order.status === 1 && (
          <Button
            onClick={() => handleConfirmSuccess(order._id)}
            color="primary"
          >
            Confirm Success
          </Button>
        )}
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

export default OrderList;
