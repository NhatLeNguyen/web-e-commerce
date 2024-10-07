import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import Dot from "../../../@extended/Dot";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/stores";
import { fetchOrders } from "../../../../redux/orders/orderThunks";

const columns: GridColDef[] = [
  {
    field: "_id",
    headerName: "Tracking No.",
    width: 250,
    sortable: true,
  },
  { field: "name", headerName: "Product Name", width: 180, sortable: true },

  {
    field: "status",
    headerName: "Status",
    width: 150,
    align: "center",
    headerAlign: "center",
    sortable: true,
    renderCell: (params) => <OrderStatus status={params.value} />,
  },
  { field: "email", headerName: "Email", width: 200, sortable: true },
  { field: "orderTime", headerName: "Order Time", width: 150, sortable: true },
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
    headerName: "",
    type: "actions",
    width: 100,
    sortable: false,
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <span
            style={{
              display: "inline-block",
              padding: "6px 12px",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Details
          </span>
        }
        label="Details"
        onClick={() => console.log("Details clicked", params.row)}
      />,
    ],
  },
];

const OrderList: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const orderStatus = useSelector((state: RootState) => state.orders.status);

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

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
    </Box>
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

export default OrderList;
