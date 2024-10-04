import React, { useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { NumericFormat } from "react-number-format";
import Dot from "../../../@extended/Dot";
import { rows } from "./Data";

const columns: GridColDef[] = [
  { field: "tracking_no", headerName: "Tracking No.", width: 150 },
  { field: "name", headerName: "Product Name", width: 180 },
  { field: "quantity", headerName: "Quantity", width: 80, type: "number" },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => <OrderStatus status={params.value} />,
  },
  { field: "email", headerName: "Email", width: 200 },
  { field: "orderTime", headerName: "Order Time", width: 150 },
  { field: "category", headerName: "Category", width: 150 },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    width: 150,
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
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <Button variant="contained" color="primary" size="small">
            Details
          </Button>
        }
        label="Details"
        onClick={() => console.log("Details clicked", params.row)}
      />,
    ],
  },
];

const OrderList: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);

  return (
    <Box sx={{ height: 800, width: "98%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.tracking_no}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 15, 20]}
        pagination
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
      sx={{ width: "100%", justifyContent: "center" }}
    >
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default OrderList;
